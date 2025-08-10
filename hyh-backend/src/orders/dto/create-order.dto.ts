import { IsOptional, IsString, IsIn } from 'class-validator';

export class CreateOrderDto {
  @IsString() cartId!: string;

  // método de pago requerido
  @IsIn(['COD', 'WHATSAPP'] as const)
  paymentMethod!: 'COD' | 'WHATSAPP';

  // datos mínimos
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() contactPhone?: string;

  // address existente o raw (simple MVP)
  @IsOptional() @IsString() addressId?: string;
  @IsOptional() addressRaw?: {
    country?: string; city?: string; line1?: string; line2?: string; phone?: string; zip?: string;
  };
}
