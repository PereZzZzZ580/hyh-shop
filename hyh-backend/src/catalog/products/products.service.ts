import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  list(_q: unknown) {
    return this.prisma.product.findMany();
  }

  facets(_q: unknown) {
    return [];
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