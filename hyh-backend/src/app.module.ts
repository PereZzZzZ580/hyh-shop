import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { ShippingModule } from './shipping/shipping.module';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { HealthModule } from './health/health.module';
import { ContactModule } from './contact/contact.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),
    MediaModule,
    CloudinaryModule,
    PrismaModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    AuthModule,
    CouponsModule,
    ShippingModule,
    AccountModule,
    HealthModule,
    ContactModule,
    PaymentsModule,
  ],
})
export class AppModule {}
