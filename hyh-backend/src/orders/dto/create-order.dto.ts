import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  cartId!: string;

@IsIn(['COD', 'WHATSAPP'] as const)
  paymentMethod!: 'COD' | 'WHATSAPP';

@IsOptional()
  @IsString()
  addressId?: string;

@IsOptional()
  @IsString()
  addressRaw?: string;

@IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}