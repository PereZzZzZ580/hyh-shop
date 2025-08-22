import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { MediaService } from '../../media/media.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductsController {
  constructor(
    private products: ProductsService,
    private media: MediaService,
  ) {}

  @Get()
  list(@Query() q: any) {
    return this.products.list(q);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const raw = typeof body?.dto === 'string' ? JSON.parse(body.dto) : body;
    raw.variants = raw.variants?.map((v: any) => ({ attributes: {}, ...v }));
    const dto = plainToInstance(CreateProductDto, raw);
    const errors = validateSync(dto, { whitelist: true });
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    const product = await this.products.create(dto, req.user.sub);
    if (images?.length) {
      await this.media.uploadMany(images, { productId: product.id });
    }
    return product;
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const raw = typeof body?.dto === 'string' ? JSON.parse(body.dto) : body;
    raw.variants = raw.variants?.map((v: any) => ({ attributes: {}, ...v }));
    const dto = plainToInstance(UpdateProductDto, raw);
    const errors = validateSync(dto, { whitelist: true, skipMissingProperties: true });
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    const product = await this.products.update(id, dto, req.user.sub);
    if (images?.length) {
      await this.media.uploadMany(images, { productId: id });
    }
    return product;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.products.delete(id, req.user.sub);
  }
}