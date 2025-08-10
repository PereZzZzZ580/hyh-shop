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

@Module({
  imports: [ConfigModule, MediaModule, CloudinaryModule, PrismaModule, CatalogModule, CartModule, OrdersModule, AuthModule, CouponsModule, ShippingModule, AccountModule],
})
export class AppModule {}
