import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import sanitizeFilename from "sanitize-filename";
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private ensureLinkTarget(dto: CreateMediaDto | UpdateMediaDto) {
    if (!dto.productId && !dto.variantId) {
      throw new BadRequestException('Debes enviar productId o variantId');
    }
  }

  async list(params: { productId?: string; variantId?: string }) {
    const { productId, variantId } = params;
    if (!productId && !variantId) throw new BadRequestException('Falta productId o variantId');
    return this.prisma.media.findMany({
      where: { productId, variantId },
      orderBy: [{ isCover: 'desc' }, { position: 'asc' }, { sort: 'asc' }, { createdAt: 'asc' }],
    });
  }

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  async uploadOne(file: Express.Multer.File, dto: CreateMediaDto) {
    this.ensureLinkTarget(dto);
    if (!file) throw new BadRequestException('No se recibió archivo');
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype))
      throw new BadRequestException('Formato de imagen no permitido');
    if (file.size > this.MAX_FILE_SIZE)
      throw new BadRequestException('La imagen supera el tamaño permitido');

    const baseName = sanitizeFilename(file.originalname.replace(/\.[^/.]+$/, ''));

    const uploaded = await this.cloudinary.uploadBuffer(file.buffer, {
      folder: dto.productId ? `hyh/products/${dto.productId}` : `hyh/variants/${dto.variantId}`,
      resource_type: 'image',
      overwrite: false,
      public_id: baseName || undefined,
    });

    const media = await this.prisma.media.create({
      data: {
        url: uploaded.secure_url,
        provider: 'cloudinary',
        publicId: uploaded.public_id,
        mimeType: file.mimetype,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        bytes: uploaded.bytes ?? file.size,
        alt: dto.alt ?? null,
        position: dto.position ?? null,
        isCover: dto.isCover ?? false,
        productId: dto.productId ?? null,
        variantId: dto.variantId ?? null,
      },
    });

    // Si se marcó como portada, desmarcar otras
    if (media.isCover) {
      await this.prisma.media.updateMany({
        where: {
          id: { not: media.id },
          productId: media.productId ?? undefined,
          variantId: media.variantId ?? undefined,
        },
        data: { isCover: false },
      });
    }

    return media;
  }

  async uploadMany(files: Express.Multer.File[], dto: CreateMediaDto) {
    const results = [] as any[];
    for (const f of files) {
      results.push(await this.uploadOne(f, dto));
    }
    return results;
  }

  async update(id: string, dto: UpdateMediaDto) {
    const existing = await this.prisma.media.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Media no encontrada');

    // si se pasa isCover=true, desmarcar otras
    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.media.update({ where: { id }, data: dto });
      if (dto.isCover === true) {
        await tx.media.updateMany({
          where: {
            id: { not: id },
            productId: res.productId ?? undefined,
            variantId: res.variantId ?? undefined,
          },
          data: { isCover: false },
        });
      }
      return res;
    });

    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.media.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Media no encontrada');

    await this.cloudinary.delete(existing.publicId || '');
    await this.prisma.media.delete({ where: { id } });
    return { ok: true };
  }
}