import { IsOptional, IsString } from 'class-validator';

export class UpsertAddressDto {
  @IsString() country!: string;
  @IsString() city!: string;
  @IsString() line1!: string;
  @IsOptional() @IsString() line2?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() zip?: string;
}

export class SetDefaultDto {
  @IsString() id!: string;
}
