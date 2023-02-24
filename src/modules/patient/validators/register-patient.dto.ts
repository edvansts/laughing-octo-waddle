import {
  Length,
  IsString,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { CIVIL_STATUS, GENDER, SEX } from 'src/constants/enum';
import { BaseAuthDto } from '../../auth/validators/base-auth.dto';

export class RegisterPatientDto extends BaseAuthDto {
  @IsString()
  @Length(4, 50)
  name: string;

  @IsDateString()
  birthdayDate: string;

  @IsString()
  @IsEnum(SEX)
  sex: SEX;

  @IsString()
  @IsEnum(GENDER)
  gender: GENDER;

  @IsString()
  @IsEnum(CIVIL_STATUS)
  civilStatus: CIVIL_STATUS;

  @IsString()
  nationality: string;

  @IsString()
  naturality: string;

  @IsString()
  ethnicity: string;

  @IsString()
  schooling: string;

  @IsString()
  profession: string;

  @IsString()
  completeAddress: string;

  @IsString()
  @IsPhoneNumber('BR')
  phoneNumber: string;

  @IsString()
  @Length(11)
  cpf: string;
}
