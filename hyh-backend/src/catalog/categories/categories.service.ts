import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async tree() {
    const cats = await this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { name: 'asc' },
    });
    return cats;
  }

  async bySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: { children: true },
    });
  }
}
