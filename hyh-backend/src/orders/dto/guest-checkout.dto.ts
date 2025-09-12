import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GuestItemDto {
  @IsString()
  variantId!: string;

  @IsInt()
  @Min(1)
  qty!: number;
}

class AddressRawDto {
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() line1?: string;
  @IsOptional() @IsString() line2?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() zip?: string;
}

export class GuestCheckoutPreviewDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => GuestItemDto)
  items!: GuestItemDto[];

  @IsOptional() @IsString()
  coupon?: string;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsIn(['COD', 'WHATSAPP', 'WOMPI'] as const)
  paymentMethod?: 'COD' | 'WHATSAPP' | 'WOMPI';
}

export class GuestCreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => GuestItemDto)
  items!: GuestItemDto[];

  @IsIn(['COD', 'WHATSAPP', 'WOMPI'] as const)
  paymentMethod!: 'COD' | 'WHATSAPP' | 'WOMPI';

  @IsOptional() @ValidateNested() @Type(() => AddressRawDto)
  addressRaw?: AddressRawDto;

  @IsOptional() @IsString()
  contactName?: string;

  @IsOptional() @IsString()
  contactPhone?: string;
}

