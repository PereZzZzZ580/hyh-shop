import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrdersController {
  constructor(private readonly orders: OrdersService, private readonly prisma: PrismaService) {}

  @Post('checkout/preview')
  preview(@Req() req: any, @Body() dto: CheckoutPreviewDto) {
    return this.orders.preview(
      dto.cartId,
      dto.coupon,
      req.user.sub,
      {
        city: dto.city,
        // Solo incluir paymentMethod si viene definido para evitar conflicto de tipos
        ...(dto.paymentMethod ? { paymentMethod: dto.paymentMethod } : {}),
      },
    );
  }

  @Post('orders')
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orders.createFromCart({
      cartId: dto.cartId,
      userId: req.user.sub,
      paymentMethod: dto.paymentMethod,
      addressId: dto.addressId ?? null,
      addressRaw: dto.addressRaw ?? null,
      contactName: dto.contactName ?? null,
      contactPhone: dto.contactPhone ?? null,
    });
  }

  // Lista los pedidos del usuario autenticado
  @Get('orders')
  async list(@Req() req: any, @Query('range') range?: string) {
    const userId = req.user.sub as string;
    const from = this.resolveRange(range);
    const orders = await this.prisma.order.findMany({
      where: { userId, ...(from ? { createdAt: { gte: from } } : {}) },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
        address: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      paymentMethod: o.paymentMethod,
      status: o.status,
      paymentStatus: o.paymentStatus,
      shipmentStatus: o.shipmentStatus,
      grandTotal: o.grandTotal,
      contactName: o.contactName,
      contactPhone: o.contactPhone,
      address: o.address
        ? { city: o.address.city, line1: o.address.line1, line2: o.address.line2, phone: o.address.phone }
        : null,
      items: o.items.map((it) => ({
        qty: it.qty,
        unitPrice: it.unitPrice,
        name: it.variant.product.name,
      })),
    }));
  }

  @Get('orders/:id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.orders.getForUser(id, req.user.sub);
  }

  @Get('orders/:id/summary')
  summary(@Req() req: any, @Param('id') id: string) {
    return this.orders.summary(id, req.user.sub);
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
