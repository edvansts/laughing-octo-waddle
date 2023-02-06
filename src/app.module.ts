import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env/validate';
import { Nutritionist } from './schemas/nutritionist.schema';
import { Person } from './schemas/person.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      // host: process.env.DB_HOST,
      // port: process.env.DB_PORT,
      // database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      models: [Person, Nutritionist],
      uri: process.env.DB_URI,
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([Person, Nutritionist]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
