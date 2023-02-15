import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  password: string;
}
