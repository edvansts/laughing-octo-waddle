import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { validateEnv } from './config/env/validate';
import { AuthModule } from './modules/auth/auth.module';
import { AnthropometricEvaluation } from './models/anthropometric-evaluation.model';
import { Appointment } from './models/appointment.model';
import { BiochemicalEvaluation } from './models/biochemical-evaluation.model';
import { ClinicalEvaluation } from './models/clinical-evaluation.model';
import { Diagnostic } from './models/diagnostic.model';
import { Guidance } from './models/guidance.model';
import { Nutritionist } from './models/nutritionist.model';
import { Patient } from './models/patient.model';
import { Person } from './models/person.model';
import { PhysicalEvaluation } from './models/physical-evaluation.model';
import { User } from './models/user.model';
import { PatientModule } from './modules/patient/patient.module';
import { NutritionistModule } from './modules/nutritionist/nutritionist.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      models: [
        Person,
        Nutritionist,
        User,
        Patient,
        Diagnostic,
        Appointment,
        Guidance,
        PhysicalEvaluation,
        BiochemicalEvaluation,
        AnthropometricEvaluation,
        ClinicalEvaluation,
      ],
      uri: process.env.DB_URI,
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    PatientModule,
    NutritionistModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
