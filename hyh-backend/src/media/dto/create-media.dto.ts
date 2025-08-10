import { IsOptional, IsString, IsUUID, IsBoolean, IsInt, Min, ValidateIf } from 'class-validator';

export class CreateMediaDto {
  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsBoolean()
  isCover?: boolean;

  @ValidateIf((o) => !o.variantId)
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ValidateIf((o) => !o.productId)
  @IsOptional()
  @IsUUID()
  variantId?: string;
}