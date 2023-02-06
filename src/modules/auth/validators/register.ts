import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsEmail } from 'class-validator';

export class RegisterBody {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(4, 50)
  name: string;
}
