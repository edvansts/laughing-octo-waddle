import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import {
  ALCOHOLIC_STATUS,
  CLINICAL_HISTORY,
  EATING_BEHAVIOR,
  ENVIRONMENT,
  FAMILIAR_BACKGROUND,
  SMOKER_STATUS,
  SYMPTOM,
} from 'src/constants/enum';

export class RegisterClinicalEvaluationDto {
  @IsString()
  medicationsAndSupplementsUsed: string;

  @IsString()
  weightLossTreatmentsPerformed: string;

  @IsString()
  @IsEnum(SMOKER_STATUS)
  smokerStatus: SMOKER_STATUS;

  @IsString()
  @IsOptional()
  smokerDescription?: string;

  @IsString()
  @IsEnum(ALCOHOLIC_STATUS)
  alcoholicStatus: ALCOHOLIC_STATUS;

  @IsString()
  @IsOptional()
  alcoholicDescription?: string;

  @IsString()
  physicalActivityDescription: string;

  @IsString()
  spareTimeDescription: string;

  @IsString()
  @IsEnum(EATING_BEHAVIOR)
  eatingBehavior: EATING_BEHAVIOR;

  @IsString()
  mainMealsAndSnacksPlaces: string;

  @IsString()
  @IsEnum(ENVIRONMENT)
  mainMealsEnvironment: ENVIRONMENT;

  @IsArray()
  @IsEnum(FAMILIAR_BACKGROUND, { each: true })
  familiarBackground: FAMILIAR_BACKGROUND[];

  @IsString()
  @IsOptional()
  otherFamiliarBackgrounds?: string;

  @IsArray()
  @IsEnum(CLINICAL_HISTORY, { each: true })
  clinicalHistory: CLINICAL_HISTORY[];

  @IsString()
  @IsOptional()
  otherClinicalHistories?: string;

  @IsArray()
  @IsEnum(SYMPTOM, { each: true })
  reportedSymptoms: SYMPTOM[];
}
