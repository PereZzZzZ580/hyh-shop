import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RuleDto {
  @ApiProperty({ enum: ['PERCENT', 'FIXED'] })
  @IsIn(['PERCENT', 'FIXED'] as const)
  type!: 'PERCENT' | 'FIXED';

  @ApiProperty()
  @IsNumber()
  value!: number;
}

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty({ type: () => RuleDto })
  @ValidateNested()
  @Type(() => RuleDto)
  rule!: RuleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startsAt?: Date | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}