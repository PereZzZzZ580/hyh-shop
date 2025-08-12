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
  async list(@Query('status') status?: string) {
    return this.prisma.order.findMany({
      where: { status: status as any || undefined },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Patch(':id/pay')
  markPaid(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { paymentStatus: 'APPROVED' } });
  }

  @Patch(':id/fulfill')
  markFulfilled(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'FULFILLED', shipmentStatus: 'DELIVERED' } });
  }
}
