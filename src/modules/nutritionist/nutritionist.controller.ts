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
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { RegisterNutritionistDto } from './validators/register-nutritionist.dto';
import { NutritionistService } from './nutritionist.service';
import { CreateAppointmentDto } from './validators/create-appointment.dto';
import { CreateNutritionistResponse } from './response/create-nutritionist.response';
import { Appointment } from 'src/models/appointment.model';
import { Guidance } from 'src/models/guidance.model';
import { CreateGuidanceDto } from './validators/create-guidance.dto';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { CreateDailyFoodConsumptionDto } from './validators/create-daily-food-consumption.dto';
import { UpdateDailyFoodConsumptionDto } from './validators/update-daily-food-consumption';

@ApiBearerAuth()
@ApiTags('nutritionist')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('nutritionist')
export class NutritionistController {
  constructor(private nutritionistService: NutritionistService) {}

  @Get('/person/:personId')
  async getNutritionistByPersonId(@Param('personId') personId: string) {
    return this.nutritionistService.getByByPersonId(personId);
  }

  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  @Post(':nutritionistId/appointment')
  @ApiCreatedResponse({ type: Appointment })
  async createAppointment(
    @Param('nutritionistId') nutritionistId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.nutritionistService.createAppointment(
      nutritionistId,
      createAppointmentDto,
    );
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreateNutritionistResponse })
  @Public()
  @Roles(ROLE.ADMIN)
  async createNutritionist(@Body() nutritionist: RegisterNutritionistDto) {
    return this.nutritionistService.create(nutritionist);
  }

  @Post('/:nutritionistId/guidance')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Guidance })
  @Roles(ROLE.ADMIN, ROLE.NUTRITIONIST)
  async createGuidance(
    @Param('nutritionistId') nutritionistId: string,
    @Body() guidanceData: CreateGuidanceDto,
  ) {
    return this.nutritionistService.createGuidance(
      nutritionistId,
      guidanceData,
    );
  }

  @Post('/patient/:patientId/food-consumption')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FoodConsumption })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createFoodConsumption(
    @Param('patientId') patientId: string,
    @Body() foodConsumption: CreateDailyFoodConsumptionDto,
  ) {
    return this.nutritionistService.createDailyFoodConsumption(
      patientId,
      foodConsumption,
    );
  }

  @Put('/patient/:patientId/food-consumption/:foodConsumptionId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FoodConsumption })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async updateFoodConsumption(
    @Param('patientId') patientId: string,
    @Param('foodConsumptionId') foodConsumptionId: string,
    @Body() foodConsumption: UpdateDailyFoodConsumptionDto,
  ) {
    return this.nutritionistService.updateDailyFoodConsumption(
      patientId,
      foodConsumptionId,
      foodConsumption,
    );
  }
}
