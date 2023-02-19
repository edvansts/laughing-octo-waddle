import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nutritionist } from 'src/models/nutritionist.model';
import { UserModule } from '../user/user.module';
import { NutritionistService } from './nutritionist.service';

@Module({
  providers: [NutritionistService],
  imports: [SequelizeModule.forFeature([Nutritionist]), UserModule],
  exports: [NutritionistService],
})
export class NutritionistModule {}
