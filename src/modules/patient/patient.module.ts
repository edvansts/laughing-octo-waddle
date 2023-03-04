import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from 'src/models/patient.model';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { FoodConsumptionModule } from '../food-consumption/food-consumption.module';
import { PhysicalEvaluation } from 'src/models/physical-evaluation.model';
import { BiochemicalEvaluation } from 'src/models/biochemical-evaluation.model';
import { AnthropometricEvaluation } from 'src/models/anthropometric-evaluation.model';

@Module({
  providers: [PatientService],
  imports: [
    SequelizeModule.forFeature([
      Patient,
      ClinicalEvaluation,
      PhysicalEvaluation,
      BiochemicalEvaluation,
      AnthropometricEvaluation,
    ]),
    AuthModule,
    UserModule,
    FoodConsumptionModule,
  ],
  exports: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}
