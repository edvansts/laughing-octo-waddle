import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from 'src/models/patient.model';
import { UserModule } from '../user/user.module';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  providers: [PatientService],
  imports: [SequelizeModule.forFeature([Patient]), UserModule],
  exports: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}
