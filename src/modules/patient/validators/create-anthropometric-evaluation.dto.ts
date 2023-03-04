import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsPositive } from 'class-validator';

export class CreateAnthropometricEvaluationDto {
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsNumber()
  @IsPositive()
  dryWeight: number;

  @IsNumber()
  @IsPositive()
  bmi: number;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  waistCircumference: number;

  @IsNumber()
  @IsPositive()
  abdominalCircumference?: number;

  @IsNumber()
  @IsPositive()
  hipCircumference: number;

  @IsNumber()
  @IsPositive()
  armCircumference: number;

  @IsNumber()
  @IsPositive()
  rightWrist: number;

  @IsNumber()
  @IsPositive()
  neckCircumference: number;

  @Type(() => Date)
  @IsDate()
  examDate: Date;
}
