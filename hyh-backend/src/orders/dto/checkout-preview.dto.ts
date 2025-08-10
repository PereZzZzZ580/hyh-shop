import { IsOptional, IsString, IsIn } from 'class-validator';

export class CheckoutPreviewDto {
  @IsString() cartId!: string;
  @IsOptional() @IsString() coupon?: string;

  // ciudad para calcular envío (recomendado para COD)
  @IsOptional() @IsString() city?: string;

  // método de pago: COD o WHATSAPP
  @IsOptional() @IsIn(['COD', 'WHATSAPP'] as const)
  paymentMethod?: 'COD' | 'WHATSAPP';
}
