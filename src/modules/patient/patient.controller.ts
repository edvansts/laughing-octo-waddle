import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiHeader,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { TotalCountInterceptor } from 'src/interceptors/total-count/total-count.interceptor';
import { BiochemicalEvaluation } from 'src/models/biochemical-evaluation.model';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { PhysicalEvaluation } from 'src/models/physical-evaluation.model';
import { TOTAL_COUNT_HEADER_DESCRIPTION } from '../common/constants';
import { PaginationDto } from '../common/validators/pagination.dto';
import { PatientService } from './patient.service';
import { CreatePatientResponse } from './response/create-patient.response';
import { CreateBiochemicalEvaluationDto } from './validators/create-biochemical-evaluation.dto';
import { CreatePhysicalEvaluationDto } from './validators/create-physical-evaluation.dto';
import { CreateClinicalEvaluationDto } from './validators/create-clinical-evaluation.dto';
import { CreateDailyFoodConsumptionDto } from './validators/create-daily-food-consumption.dto';
import { CreatePatientDto } from './validators/create-patient.dto';
import { UpdateDailyFoodConsumptionDto } from './validators/update-daily-food-consumption';
import { UpdatePatientDto } from './validators/update-patient.dto';
import { AnthropometricEvaluation } from 'src/models/anthropometric-evaluation.model';
import { CreateAnthropometricEvaluationDto } from './validators/create-anthropometric-evaluation.dto';

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
  async createPatient(@Body() patient: CreatePatientDto) {
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
    @Body() clinicalEvaluation: CreateClinicalEvaluationDto,
  ) {
    return this.patientService.createClinicalEvaluation(
      patientId,
      clinicalEvaluation,
    );
  }

  @Post(':patientId/food-consumption')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FoodConsumption })
  @Roles(ROLE.PATIENT)
  async createFoodConsumption(
    @Param('patientId') patientId: string,
    @Body() foodConsumption: CreateDailyFoodConsumptionDto,
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
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getFoodConsumptions(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getDailyFoodConsumptions(patientId, pagination);
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
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiOkResponse({ type: [PhysicalEvaluation] })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getPhysicalEvaluations(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getPhysicalEvaluations(patientId, pagination);
  }

  @Post(':patientId/biochemical-evaluation')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BiochemicalEvaluation })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createBiochemicalEvaluation(
    @Param('patientId') patientId: string,
    @Body() biochemicalEvaluation: CreateBiochemicalEvaluationDto,
  ) {
    return this.patientService.createBiochemicalEvaluation(
      patientId,
      biochemicalEvaluation,
    );
  }

  @Get(':patientId/biochemical-evaluation')
  @ApiBearerAuth()
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiOkResponse({ type: [BiochemicalEvaluation] })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getBiochemicalEvaluations(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getBiochemicalEvaluations(patientId, pagination);
  }

  @Post(':patientId/anthropometric-evaluation')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BiochemicalEvaluation })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createAnthropometricEvaluation(
    @Param('patientId') patientId: string,
    @Body() anthropometricEvaluation: CreateAnthropometricEvaluationDto,
  ) {
    return this.patientService.createAnthropometricEvaluation(
      patientId,
      anthropometricEvaluation,
    );
  }

  @Get(':patientId/anthropometric-evaluation')
  @ApiBearerAuth()
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiOkResponse({ type: [AnthropometricEvaluation] })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getAnthropometricEvaluations(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getAnthropometricEvaluations(
      patientId,
      pagination,
    );
  }
}
