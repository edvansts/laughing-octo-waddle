import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { PhysicalEvaluation } from 'src/models/physical-evaluation.model';
import { PatientService } from './patient.service';
import { CreatePatientResponse } from './response/create-patient.response';
import { CreatePhysicalEvaluationDto } from './validators/create-physical-evaluation';
import { RegisterClinicalEvaluationDto } from './validators/register-clinical-evaluation.dto';
import { RegisterDailyFoodConsumptionDto } from './validators/register-daily-food-consumption';
import { RegisterPatientDto } from './validators/register-patient.dto';
import { UpdateDailyFoodConsumptionDto } from './validators/update-daily-food-consumption';
import { UpdatePatientDto } from './validators/update-patient.dto';

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
  @ApiCreatedResponse({ type: CreatePatientResponse })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createPatient(@Body() patient: RegisterPatientDto) {
    return this.patientService.create(patient);
  }

  @Put(':patientId')
  @ApiBearerAuth()
  @ApiGoneResponse()
  async updatePatient(
    @Param('patientId') patientId: string,
    @Body() patient: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(patientId, patient);
  }

  @Get(':patientId/clinical-evaluation')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ClinicalEvaluation })
  async getClinicalEvaluation(@Param('patientId') patientId: string) {
    return this.patientService.getClinicalEvaluationById(patientId);
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

  @Get(':patientId/food-consumption')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ClinicalEvaluation })
  async getFoodConsumption(@Param('patientId') patientId: string) {
    return this.patientService.getClinicalEvaluationById(patientId);
  }

  @Post(':patientId/food-consumption')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FoodConsumption })
  @Roles(ROLE.PATIENT)
  async createFoodConsumption(
    @Param('patientId') patientId: string,
    @Body() foodConsumption: RegisterDailyFoodConsumptionDto,
  ) {
    return this.patientService.createDailyFoodConsumption(
      patientId,
      foodConsumption,
    );
  }

  @Put(':patientId/food-consumption/:foodConsumptionId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FoodConsumption })
  @Roles(ROLE.PATIENT)
  async updateFoodConsumption(
    @Param('patientId') patientId: string,
    @Param('foodConsumptionId') foodConsumptionId: string,
    @Body() foodConsumption: UpdateDailyFoodConsumptionDto,
  ) {
    return this.patientService.updateDailyFoodConsumption(
      patientId,
      foodConsumptionId,
      foodConsumption,
    );
  }

  @Get(':patientId/food-consumption')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FoodConsumption] })
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getDailyFoodConsumptions(@Param('patientId') patientId: string) {
    return this.patientService.getDailyFoodConsumptions(patientId);
  }

  @Post(':patientId/physical-evalution')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PhysicalEvaluation })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createPhysicalEvaluation(
    @Param('patientId') patientId: string,
    @Body() physicalEvaluation: CreatePhysicalEvaluationDto,
  ) {
    return this.patientService.createPhysicalEvaluation(
      patientId,
      physicalEvaluation,
    );
  }

  @Get(':patientId/physical-evalution')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [PhysicalEvaluation] })
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getPhysicalEvaluations(@Param('patientId') patientId: string) {
    return this.patientService.getPhysicalEvaluations(patientId);
  }
}
