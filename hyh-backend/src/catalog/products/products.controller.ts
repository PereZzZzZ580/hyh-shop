import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

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

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.products.bySlug(slug);
  }
}
