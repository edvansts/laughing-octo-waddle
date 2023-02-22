import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nutritionist } from 'src/models/nutritionist.model';
import { NutritionistService } from './nutritionist.service';
import { NutritionistController } from './nutritionist.controller';
import { PatientModule } from '../patient/patient.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [NutritionistService],
  imports: [
    SequelizeModule.forFeature([Nutritionist]),
    AuthModule,
    PatientModule,
    AppointmentsModule,
  ],
  exports: [NutritionistService],
  controllers: [NutritionistController],
})
export class NutritionistModule {}
