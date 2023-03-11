import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nutritionist } from 'src/models/nutritionist.model';
import { NutritionistService } from './nutritionist.service';
import { NutritionistController } from './nutritionist.controller';
import { PatientModule } from '../patient/patient.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GuidanceModule } from '../guidance/guidance.module';
import { FoodConsumptionModule } from '../food-consumption/food-consumption.module';
import { NutritionalDataModule } from '../nutritional-data/nutritional-data.module';

@Module({
  providers: [NutritionistService],
  imports: [
    SequelizeModule.forFeature([Nutritionist]),
    AuthModule,
    UserModule,
    PatientModule,
    AppointmentsModule,
    GuidanceModule,
    FoodConsumptionModule,
    NutritionalDataModule,
  ],
  exports: [NutritionistService],
  controllers: [NutritionistController],
})
export class NutritionistModule {}
