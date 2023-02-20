import { Length, IsString } from 'class-validator';
import { BaseAuthDto } from './base-auth.dto';

export class RegisterPatientDto extends BaseAuthDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsString()
  @Length(11)
  cpf: string;
}
