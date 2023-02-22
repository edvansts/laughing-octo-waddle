import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { User } from 'src/models/user.model';
import { RegisterNutritionistDto } from '../auth/validators/register-nutritionist.dto';
import { NutritionistService } from './nutritionist.service';
import { CreateAppointmentDto } from './validators/create-appointment.dto';

@ApiBearerAuth()
@ApiTags('nutritionist')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('nutritionist')
export class NutritionistController {
  constructor(private nutritionistService: NutritionistService) {}

  @Get(':personId')
  async getNutritionistByPersonId(@Param('id') id: string) {
    return this.nutritionistService.getNutritionistByPersonId(id);
  }

  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  @Post('register/appointment')
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.nutritionistService.createAppointment(createAppointmentDto);
  }

  @Post('register')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  @Public()
  @Roles(ROLE.ADMIN)
  async createNutritionist(@Body() nutritionist: RegisterNutritionistDto) {
    return this.nutritionistService.create(nutritionist);
  }
}
