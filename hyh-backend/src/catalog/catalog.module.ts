import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller.js';
import { ProductsService } from './products/products.service.js';
import { CategoriesController } from './categories/categories.controller.js';
import { CategoriesService } from './categories/categories.service.js';

@Module({
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService],
})
export class CatalogModule {}
