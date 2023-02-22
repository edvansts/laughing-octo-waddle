import { IsEnum, IsString, Length } from 'class-validator';
import { ROLE } from 'src/constants/user';

import { BaseAuthDto } from 'src/modules/auth/validators/base-auth.dto';

export class CreateUserDto extends BaseAuthDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsString()
  @Length(11)
  cpf: string;

  @IsEnum(ROLE)
  role: ROLE;
}
