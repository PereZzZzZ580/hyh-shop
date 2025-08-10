import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddItemDto {
  @IsString() variantId!: string;
  @IsInt() @Min(1) qty!: number;

  // si es anónimo, pasar anonId; si estás logueado, lo ignoramos por ahora
  @IsOptional() @IsString() anonId?: string;
}
