import { IsString, MinLength } from 'class-validator';

export class CreateGuidanceDto {
  @IsString()
  patientId: string;

  @IsString()
  @MinLength(5)
  nutritionalGuidance: string;
}
