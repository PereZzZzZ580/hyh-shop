import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async create(userId: string, data: any) {
    return this.prisma.address.create({ data: { ...data, userId, isDefault: false } });
  }

  async update(userId: string, id: string, data: any) {
    const a = await this.prisma.address.findUnique({ where: { id } });
    if (!a) throw new NotFoundException();
    if (a.userId !== userId) throw new ForbiddenException();
    return this.prisma.address.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    const a = await this.prisma.address.findUnique({ where: { id } });
    if (!a) return;
    if (a.userId !== userId) throw new ForbiddenException();
    return this.prisma.address.delete({ where: { id } });
  }

  async setDefault(userId: string, id: string) {
    const a = await this.prisma.address.findUnique({ where: { id } });
    if (!a) throw new NotFoundException();
    if (a.userId !== userId) throw new ForbiddenException();
    await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    await this.prisma.address.update({ where: { id }, data: { isDefault: true } });
    return { ok: true };
  }
}
