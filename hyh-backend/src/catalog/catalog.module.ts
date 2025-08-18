import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/roles.guard';
import { MediaModule } from '../media/media.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { AdminProductsController } from './products/admin.controller';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
@Module({
  imports: [
    MediaModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        limits: { fileSize: Number(config.get('MAX_IMAGE_SIZE_MB', 8)) * 1024 * 1024 },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductsController, CategoriesController, AdminProductsController],
  providers: [ProductsService, CategoriesService, RolesGuard],
})
export class CatalogModule {}
