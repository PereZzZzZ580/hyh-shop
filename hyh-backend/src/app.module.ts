import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { CatalogModule } from './catalog/catalog.module.js';

@Module({
  imports: [PrismaModule, CatalogModule],
})
export class AppModule {}
