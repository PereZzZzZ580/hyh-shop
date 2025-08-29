import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import sanitizeFilename from 'sanitize-filename';
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

  async list(params: { productId?: string; variantId?: string }) {
    const { productId, variantId } = params;
    const where =
      productId || variantId
        ? { productId, variantId }
        : { productId: null, variantId: null };
    return this.prisma.media.findMany({
      where,
      orderBy: [
        { isCover: 'desc' },
        { position: 'asc' },
        { sort: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];
  private readonly ALLOWED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  async uploadOne(file: Express.Multer.File, dto: CreateMediaDto) {
    if (!file) throw new BadRequestException('No se recibió archivo');
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');
    if (!isImage && !isVideo) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }
    if (isImage && !this.ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype))
      throw new BadRequestException('Formato de imagen no permitido');
    if (isVideo && !this.ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype))
      throw new BadRequestException('Formato de video no permitido');
    if (isImage && file.size > this.MAX_IMAGE_SIZE)
      throw new BadRequestException('La imagen supera el tamaño permitido');
    if (isVideo && file.size > this.MAX_VIDEO_SIZE)
      throw new BadRequestException('El video supera el tamaño permitido');

    const baseName = sanitizeFilename(
      file.originalname.replace(/\.[^/.]+$/, ''),
    );

    const folder = dto.productId
      ? `hyh/products/${dto.productId}`
      : dto.variantId
      ? `hyh/variants/${dto.variantId}`
      : 'hyh/gallery';

    const uploaded = await this.cloudinary.uploadBuffer(file.buffer, {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      overwrite: false,
      public_id: baseName || undefined,
    });

    const media = await this.prisma.media.create({
      data: {
        url: (uploaded as any).secure_url,
        provider: 'cloudinary',
        publicId: (uploaded as any).public_id,
        mimeType: file.mimetype,
        width: (uploaded as any).width ?? null,
        height: (uploaded as any).height ?? null,
        bytes: (uploaded as any).bytes ?? file.size,
        alt: (dto as any).alt ?? null,
        position: (dto as any).position ?? null,
        isCover: (dto as any).isCover ?? false,
        productId: (dto as any).productId ?? null,
        variantId: (dto as any).variantId ?? null,
      },
    });

    // Si se marcó como portada, desmarcar otras
    if (media.isCover) {
      await this.prisma.media.updateMany({
        where: {
          id: { not: media.id },
          productId: media.productId,
          variantId: media.variantId,
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
      if ((dto as any).isCover === true) {
        await tx.media.updateMany({
          where: {
            id: { not: id },
            productId: res.productId,
            variantId: res.variantId,
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

    const resourceType = existing.mimeType?.startsWith('video/') ? 'video' : 'image';
    await this.cloudinary.delete(existing.publicId || '', resourceType as any);
    await this.prisma.media.delete({ where: { id } });
    return { ok: true };
  }
}

