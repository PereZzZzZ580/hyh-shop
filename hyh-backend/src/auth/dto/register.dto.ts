import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Contraseña fuerte: 10+ chars, mayúsculas, minúsculas, número y símbolo' })
  @IsString()
  @MinLength(10)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message: 'La contraseña debe incluir mayúsculas, minúsculas, número y símbolo',
  })
  password!: string;

  @ApiProperty()
  @IsString()
  name!: string;
}
