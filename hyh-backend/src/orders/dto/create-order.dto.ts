import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressRawDto {
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() line1?: string;
  @IsOptional() @IsString() line2?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() zip?: string;
}
export class CreateOrderDto {
  @IsString()
  cartId!: string;

 @IsIn(['COD', 'WHATSAPP'] as const)
  paymentMethod!: 'COD' | 'WHATSAPP';

  @IsOptional() @IsString()
  addressId?: string;

@IsOptional() @ValidateNested() @Type(() => AddressRawDto)
  addressRaw?: AddressRawDto;

  @IsOptional() @IsString()
  contactName?: string;

  @IsOptional() @IsString()
  contactPhone?: string;
}