import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { User } from 'src/models/user.model';
import { PatientService } from './patient.service';
import { RegisterPatientDto } from './validators/register-patient.dto';

@ApiTags('patient')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get(':personId')
  async getPatientByPersonId(@Param('id') id: string) {
    return this.patientService.getPatientByPersonId(id);
  }

  @Post('register')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createPatient(@Body() patient: RegisterPatientDto) {
    return this.patientService.create(patient);
  }
}
