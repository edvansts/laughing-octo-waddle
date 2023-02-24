import { ApiHideProperty } from '@nestjs/swagger';
import {
  Length,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { BaseAuthDto } from '../../auth/validators/base-auth.dto';

export class RegisterNutritionistDto extends BaseAuthDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsDateString()
  birthdayDate: string;

  @IsString()
  @MinLength(5)
  crn: string;

  @IsString()
  @Length(11)
  cpf: string;

  @ApiHideProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
