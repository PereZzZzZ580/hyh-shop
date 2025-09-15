import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { GuestOrdersController } from './guest.controller';
import { OrdersService } from './orders.service';
import { PricingModule } from '../common/pricing/pricing.module';
import { AdminOrdersController } from './admin.controller';
import { RolesGuard } from '../auth/roles.guard';
import { CouponsModule } from '../coupons/coupons.module';
import { ShippingModule } from '../shipping/shipping.module';
import { PaymentsModule } from '../payments/payments.module';
import { SheetsService } from './sheets.service';
import { WhatsappNotifyService } from './whatsapp.service';
import { OrdersEmailService } from './email.service';

@Module({
  imports: [PricingModule, CouponsModule, ShippingModule, PaymentsModule],
  controllers: [OrdersController, AdminOrdersController, GuestOrdersController],
  providers: [OrdersService, RolesGuard, SheetsService, WhatsappNotifyService, OrdersEmailService],
})
export class OrdersModule {}
