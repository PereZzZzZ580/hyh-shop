import { IsString } from 'class-validator';
export class SetDefaultDto {
  @IsString()
  userId!: string; // o tomarlo del JWT si ya tienes auth
}