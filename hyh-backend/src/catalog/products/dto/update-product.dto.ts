import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { UpdateVariantDto } from './update-variant.dto';

  export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['variants'] as const),
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  variants?: UpdateVariantDto[];
}
