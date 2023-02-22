import {
  Length,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { BaseAuthDto } from '../../auth/validators/base-auth.dto';

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

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
