import { PartialType } from '@nestjs/mapped-types';
import { RegisterPatientDto } from './register-patient.dto';

export class UpdatePatientDto extends PartialType(RegisterPatientDto) {}
