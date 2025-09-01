import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(q: any): Prisma.ProductWhereInput {
    const {
      categoryId,
      categorySlug,
      minPrice,
      maxPrice,
      brand,
      targetGender,
      hairType,
      search,
    } = q;

    const where: Prisma.ProductWhereInput = { archivedAt: null };

    if (categoryId) where.categoryId = String(categoryId);
    if (categorySlug)
      where.category = { slug: String(categorySlug) };
    if (brand) where.brand = String(brand);
    if (targetGender) where.targetGender = String(targetGender);
    if (hairType) {
      const hair = Array.isArray(hairType)
        ? hairType
        : String(hairType).split(',');
      where.hairType = { hasSome: hair };
    }
    if (search) {
      where.name = { contains: String(search), mode: 'insensitive' };
    }
    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          ...(minPrice ? { price: { gte: Number(minPrice) } } : {}),
          ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}),
        },
      };
    }

    return where;
  }

  private buildFacets(rows: any[]) {
    const categories: Record<string, any> = {};
    const brands: Record<string, number> = {};
    const genders: Record<string, number> = {};
    const hair: Record<string, number> = {};

    for (const r of rows) {
      if (r.category) {
        const { id, name, slug } = r.category;
        categories[id] ??= { id, name, slug, count: 0 };
        categories[id].count++;
      }
      if (r.brand) brands[r.brand] = (brands[r.brand] || 0) + 1;
      if (r.targetGender)
        genders[r.targetGender] = (genders[r.targetGender] || 0) + 1;
      if (r.hairType) {
        for (const h of r.hairType) {
          hair[h] = (hair[h] || 0) + 1;
        }
      }
    }

    return {
      categories: Object.values(categories),
      brands: Object.entries(brands).map(([value, count]) => ({ value, count })),
      targetGender: Object.entries(genders).map(([value, count]) => ({
        value,
        count,
      })),
      hairType: Object.entries(hair).map(([value, count]) => ({ value, count })),
    };
  }

  async list(q: any) {
    const page = Number(q.page) || 1;
    const perPage = Number(q.perPage) || 20;
    const where = this.buildWhere(q);

    const [items, total, facets] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { sort: 'asc' } },
          variants: { orderBy: { price: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.product.count({ where }),
      this.facets(q),
    ]);

    const meta = {
      total,
      page,
      perPage,
      pageCount: Math.ceil(total / perPage),
    };

    return { items, meta, facets };
  }

  async facets(q: any) {
    const where = this.buildWhere(q);
    const rows = await this.prisma.product.findMany({
      where,
      select: {
        brand: true,
        targetGender: true,
        hairType: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return this.buildFacets(rows);
  }

  async bySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { slug, archivedAt: null },
      include: {
        images: {                         // o cambia a media si tu producto usa "media"
          select: { id: true, url: true },
          orderBy: { sort: "asc" },
        },
        variants: {
          orderBy: { price: "asc" },
          include: {
            media: {                      // ✅ Media de cada variante
              select: { id: true, url: true },
              orderBy: { createdAt: "asc" },
            },
          },
        },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }
  async create(dto: CreateProductDto, userId: string) {
    const { variants, ...productData } = dto;

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
      select: { id: true },
    });
    if (!category)
      throw new BadRequestException('La categoría no existe');

    const product = await this.prisma.product.create({
      data: {
        ...(productData as Prisma.ProductUncheckedCreateInput),
        ...(variants?.length
          ?{
            variants: {
              create: variants.map((v) => ({
                attributes: v.attributes,
                price: v.price,
                compareAtPrice: v.compareAtPrice ?? undefined,
                stock: v.stock ?? undefined,
              })),
            },
          }
          : {}),
      },
    });
    await this.prisma.productLog.create({
      data: { productId: product.id, userId, action: 'CREATE' },
    });
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
        select: { id: true },
      });
      if (!category)
        throw new BadRequestException('La categoría no existe');
    }
    
    const product = await this.prisma.product.update({
      where: { id },
      data: dto as Prisma.ProductUncheckedUpdateInput,
    });
    await this.prisma.productLog.create({
      data: { productId: id, userId, action: 'UPDATE' },
    });
    return product;
  }

  // services/products.service.ts
  async delete(id: string, userId: string) {
    // Siempre archivar para evitar conflictos de FKs con órdenes históricas
    await this.prisma.$transaction(async (tx) => {
      const p = await tx.product.findUnique({ where: { id }, select: { slug: true } });
      const variants = await tx.variant.findMany({ where: { productId: id }, select: { id: true } });
      const variantIds = variants.map(v => v.id);

      const newSlug = `${p?.slug ?? 'producto'}--deleted--${Date.now()}`;

      await tx.product.update({
        where: { id },
        data: { archivedAt: new Date(), slug: newSlug },
      });

      if (variantIds.length) {
        await tx.variant.updateMany({ where: { id: { in: variantIds } }, data: { stock: 0 } });
      }

      // Limpieza ligera que no viola FKs
      await tx.productLog.deleteMany({ where: { productId: id, action: 'UPDATE' } });
      await tx.tagOnProduct.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.media.deleteMany({ where: { productId: id } });

      await tx.productLog.create({ data: { productId: id, userId, action: 'ARCHIVE' } });
    });

    return { id };
  }

}
