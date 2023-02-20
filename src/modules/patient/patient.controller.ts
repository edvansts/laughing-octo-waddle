import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { PatientService } from './patient.service';

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
}
