import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';

export class LoginBody {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  password: string;
}
