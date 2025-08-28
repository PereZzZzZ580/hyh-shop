import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class CreateVariantDto {
  @IsObject()
  attributes!: Record<string, any>;

  @IsInt({ message: 'price must be a number' })
  @Min(0)
  price!: number;

  @IsOptional()
  @IsInt({ message: 'compareAtPrice must be a number' })
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @IsInt({ message: 'stock must be a number' })
  @Min(0)
  stock?: number;
}
