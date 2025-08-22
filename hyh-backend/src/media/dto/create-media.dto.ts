import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
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

  
  @IsOptional()
  @IsString()
  productId?: string;

  
  @IsOptional()
  @IsString()
  variantId?: string;
}