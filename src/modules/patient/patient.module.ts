import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from 'src/models/patient.model';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [PatientService],
  imports: [SequelizeModule.forFeature([Patient]), AuthModule],
  exports: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}
