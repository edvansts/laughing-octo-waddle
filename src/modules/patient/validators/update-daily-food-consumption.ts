import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Feeding } from 'src/types/food';
import { CreateDailyFoodConsumptionDto } from './create-daily-food-consumption.dto';

export class FeedingsDto implements Feeding {
  @IsString()
  @IsNotEmpty()
  food: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;
}

export class FoodRecordDto {
  @Type(() => Date)
  @IsDate()
  mealTime: Date;

  @IsArray()
  @IsNotEmpty()
  @Type(() => FeedingsDto)
  feedings: FeedingsDto[];
}

export class UpdateDailyFoodConsumptionDto extends OmitType(
  CreateDailyFoodConsumptionDto,
  ['linkedDay'],
) {}
