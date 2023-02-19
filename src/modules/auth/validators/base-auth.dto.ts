import { ApiExtraModels } from '@nestjs/swagger';
import { Length, IsString, IsEmail } from 'class-validator';

@ApiExtraModels()
export class BaseAuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 30)
  password: string;
}
