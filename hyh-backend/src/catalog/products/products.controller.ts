import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query() q: any) {
    return this.products.list(q);
  }

  @Get('facets')
  facets(@Query() q: any) {
    return this.products.facets(q);
  }
}
