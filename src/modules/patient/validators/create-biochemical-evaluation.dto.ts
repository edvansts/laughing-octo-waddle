import { IsString } from 'class-validator';

export class CreateBiochemicalEvaluationDto {
  @IsString()
  hemoglobin: string;

  @IsString()
  hematocrit: string;

  @IsString()
  rbcs: string;

  @IsString()
  platelets: string;

  @IsString()
  leukocytes: string;

  @IsString()
  totalCholesterol: string;

  @IsString()
  ldl: string;

  @IsString()
  hdl: string;

  @IsString()
  vldl: string;

  @IsString()
  triglycerides: string;

  @IsString()
  totalLipids: string;

  @IsString()
  totalProteins: string;

  @IsString()
  preAlbumin?: string;

  @IsString()
  albumin: string;

  @IsString()
  globulin: string;

  @IsString()
  fastingGlucose: string;

  @IsString()
  postprandialGlucose: string;

  @IsString()
  hemoglobinGlycad: string;

  @IsString()
  tgo: string;

  @IsString()
  tgp: string;

  @IsString()
  ggt: string;

  @IsString()
  cpk: string;

  @IsString()
  calcium: string;

  @IsString()
  ionizedCalcium: string;

  @IsString()
  phosphorus: string;

  @IsString()
  tsh: string;

  @IsString()
  t4l: string;

  @IsString()
  totalBilirubin: string;

  @IsString()
  directBilirubin: string;

  @IsString()
  inr: string;

  @IsString()
  alt: string;

  @IsString()
  ast: string;
}
