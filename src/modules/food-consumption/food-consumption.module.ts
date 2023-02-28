import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { FoodRecord } from 'src/models/food-record.model';
import { FoodConsumptionService } from './food-consumption.service';

@Module({
  providers: [FoodConsumptionService],
  imports: [SequelizeModule.forFeature([FoodConsumption, FoodRecord])],
  exports: [FoodConsumptionService],
})
export class FoodConsumptionModule {}
