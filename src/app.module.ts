import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { validateEnv } from './config/env/validate';
import { AuthModule } from './modules/auth/auth.module';
import { AnthropometricEvaluation } from './schemas/anthropometric-evaluation.schema';
import { Appointment } from './schemas/appointment.schema';
import { BiochemicalEvaluation } from './schemas/biochemical-evaluation.schema';
import { ClinicalEvaluation } from './schemas/clinical-evaluation.schema';
import { Diagnostic } from './schemas/diagnostic.schema';
import { Guidance } from './schemas/guidance.schema';
import { Nutritionist } from './schemas/nutritionist.schema';
import { Patient } from './schemas/patient.schema';
import { Person } from './schemas/person.schema';
import { PhysicalEvaluation } from './schemas/physical-evaluation.schema';
import { User } from './schemas/user.schema';

@Module({
  imports: [
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
    }),
    SequelizeModule.forFeature([Person, Nutritionist]),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
