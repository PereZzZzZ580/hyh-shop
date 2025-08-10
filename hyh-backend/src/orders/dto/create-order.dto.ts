import { IsArray, ValidateNested, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum PaymentMethod { COD = 'COD', WHATSAPP = 'WHATSAPP' }

class OrderItemInput {
  @IsString() variantId!: string;
  @IsString() quantity!: string; // o number + Transform
}

export class CreateOrderDto {
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() note?: string;

  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemInput)
  items!: OrderItemInput[];
}