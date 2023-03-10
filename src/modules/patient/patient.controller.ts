import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
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
import { CreatePatientDto } from './validators/create-patient.dto';
import { UpdatePatientDto } from './validators/update-patient.dto';
import { AnthropometricEvaluation } from 'src/models/anthropometric-evaluation.model';
import { CreateAnthropometricEvaluationDto } from './validators/create-anthropometric-evaluation.dto';
import { Guidance } from 'src/models/guidance.model';
import { RegisterHistoryWeightGainDto } from './validators/register-history-weight-gain.dto';
import { BodyEvolution } from 'src/models/body-evolution.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { TotalCountInterceptor } from 'src/config/interceptors/total-count.interceptor';
import { toMb } from 'src/utils/transform';
import { IMAGE_EXTENSION_REGEX } from 'src/constants/regex';

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
  @HttpCode(204)
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

  @Get(':patientId/food-consumption')
  @ApiBearerAuth()
  @ApiOkResponse({ type: [FoodConsumption] })
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
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

  @Get(':patientId/guidance')
  @ApiBearerAuth()
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiOkResponse({ type: [Guidance] })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getGuidances(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getGuidances(patientId, pagination);
  }

  @Post(':patientId/history-weight-gain')
  @ApiBearerAuth()
  @ApiGoneResponse()
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.ADMIN, ROLE.NUTRITIONIST)
  async registerHistoryWeightGain(
    @Param('patientId') patientId: string,
    @Body() data: RegisterHistoryWeightGainDto,
  ) {
    return this.patientService.registerHistoryWeightGain(patientId, data);
  }

  @Post(':patientId/body-evolution')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: BodyEvolution })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT)
  async createBodyEvolution(
    @Param('patientId') patientId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: toMb(5) }),
          new FileTypeValidator({
            fileType: IMAGE_EXTENSION_REGEX,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.patientService.createBodyEvolution(patientId, file);
  }

  @Get(':patientId/body-evolution')
  @ApiBearerAuth()
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiOkResponse({ type: [BodyEvolution] })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT, ROLE.NUTRITIONIST, ROLE.ADMIN)
  async getBodyEvolutions(
    @Param('patientId') patientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.patientService.getBodyEvolutions(patientId, pagination);
  }

  @Delete(':patientId/body-evolution/:bodyEvolutionId')
  @ApiBearerAuth()
  @UseInterceptors(TotalCountInterceptor)
  @ApiQuery({ type: PaginationDto })
  @ApiHeader(TOTAL_COUNT_HEADER_DESCRIPTION)
  @ApiGoneResponse()
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLE.PATIENT)
  async deleteBodyEvolution(
    @Param('patientId') patientId: string,
    @Param('bodyEvolutionId') bodyEvolutionId: string,
  ) {
    return this.patientService.deleteBodyEvolution(patientId, bodyEvolutionId);
  }
}
