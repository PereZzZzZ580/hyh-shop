import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

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

    const where: Prisma.ProductWhereInput = {};

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
    const p = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sort: 'asc' } },
        variants: { orderBy: { price: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return p;
  }
}