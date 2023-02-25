import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { User } from 'src/models/user.model';
import { PatientService } from './patient.service';
import { RegisterClinicalEvaluationDto } from './validators/register-clinical-evaluation.dto';
import { RegisterPatientDto } from './validators/register-patient.dto';

@ApiTags('patient')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get('/person/:personId')
  async getPatientByPersonId(@Param('personId') personId: string) {
    return this.patientService.getPatientByPersonId(personId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createPatient(@Body() patient: RegisterPatientDto) {
    return this.patientService.create(patient);
  }

  @Post(':patientId/clinical-evaluation')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ClinicalEvaluation })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createClinicalEvaluation(
    @Param('patientId') patientId: string,
    @Body() clinicalEvaluation: RegisterClinicalEvaluationDto,
  ) {
    return this.patientService.createClinicalEvaluation(
      patientId,
      clinicalEvaluation,
    );
  }
}
