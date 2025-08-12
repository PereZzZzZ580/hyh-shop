import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PricingModule } from '../common/pricing/pricing.module';
import { AdminOrdersController } from './admin.controller';
import { RolesGuard } from '../auth/roles.guard';
import { CouponsModule } from '../coupons/coupons.module';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [PricingModule, CouponsModule, ShippingModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, RolesGuard],
})
export class OrdersModule {}
