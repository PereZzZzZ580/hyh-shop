import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('checkout/preview')
  preview(@Req() req: any, @Body() dto: CheckoutPreviewDto) {
    return this.orders.preview(dto.cartId, dto.coupon, req.user.sub, {
      city: dto.city,
      paymentMethod: dto.paymentMethod,
    });
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

  @Get('orders/:id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.orders.getForUser(id, req.user.sub);
  }

  @Get('orders/:id/summary')
  summary(@Req() req: any, @Param('id') id: string) {
    return this.orders.summary(id, req.user.sub);
  }
}
