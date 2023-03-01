import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePhysicalEvaluationDto {
  @IsString()
  @IsNotEmpty()
  hair: string;

  @IsString()
  @IsNotEmpty()
  bichartBalls: string;

  @IsString()
  @IsNotEmpty()
  facialSkin: string;

  @IsString()
  @IsNotEmpty()
  lips: string;

  @IsString()
  @IsNotEmpty()
  tongue: string;

  @IsString()
  @IsNotEmpty()
  eyes: string;

  @IsString()
  @IsNotEmpty()
  trunkSkin: string;

  @IsString()
  @IsNotEmpty()
  nails: string;

  @IsString()
  @IsNotEmpty()
  armpits: string;

  @IsString()
  @IsNotEmpty()
  upperLimbs: string;

  @IsString()
  @IsNotEmpty()
  lowerLimbsLegs: string;

  @IsString()
  @IsNotEmpty()
  lowerLimbsFeet: string;

  @IsString()
  otherInformations?: string;

  @IsString()
  @IsNotEmpty()
  historyWeightGain: string;
}
