import { IsString } from 'class-validator';

export class CreateNutritionalDataDto {
  @IsString()
  description: string;
}
