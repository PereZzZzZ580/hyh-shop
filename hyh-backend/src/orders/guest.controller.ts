import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GuestCheckoutPreviewDto, GuestCreateOrderDto } from './dto/guest-checkout.dto';

@Controller('guest')
export class GuestOrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('checkout/preview')
  preview(@Body() dto: GuestCheckoutPreviewDto) {
    return this.orders.previewGuest({
      items: dto.items,
      coupon: dto.coupon,
      city: dto.city,
      paymentMethod: dto.paymentMethod,
    });
  }

  @Post('orders')
  create(@Body() dto: GuestCreateOrderDto) {
    return this.orders.createGuest({
      items: dto.items,
      paymentMethod: dto.paymentMethod,
      addressRaw: dto.addressRaw ?? null,
      contactName: dto.contactName ?? null,
      contactPhone: dto.contactPhone ?? null,
    });
  }
}

