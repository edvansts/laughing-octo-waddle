import { Length, IsString, MinLength } from 'class-validator';
import { BaseAuthDto } from './base-auth.dto';

export class RegisterNutritionistDto extends BaseAuthDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsString()
  @MinLength(5)
  crn: string;

  @IsString()
  @Length(11)
  cpf: string;
}
