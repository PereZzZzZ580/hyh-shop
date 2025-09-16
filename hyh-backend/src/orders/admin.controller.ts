import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('status') status?: string, @Query('range') range?: string) {
    const from = this.resolveRange(range);
    return this.prisma.order.findMany({
      where: { status: status as any || undefined, ...(from ? { createdAt: { gte: from } } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Patch(':id/pay')
  markPaid(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { paymentStatus: 'APPROVED', status: 'PAID' } });
  }

  @Patch(':id/fulfill')
  markFulfilled(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'FULFILLED', shipmentStatus: 'DELIVERED' } });
  }

  @Patch(':id/pending')
  markPending(@Param('id') id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'PENDING', paymentStatus: 'INITIATED', shipmentStatus: 'NONE' },
    });
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  @Patch(':id/refund')
  refund(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' } });
  }
  private resolveRange(range?: string): Date | null {
    if (!range || range === 'all') {
      return null;
    }
    const now = new Date();
    switch (range) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case '3d':
        return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  }
}
