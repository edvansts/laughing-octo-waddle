import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { FoodRecord } from 'src/models/food-record.model';
import { RegisterDailyFoodConsumptionDto } from '../patient/validators/register-daily-food-consumption.dto';
import { UpdateDailyFoodConsumptionDto } from '../patient/validators/update-daily-food-consumption';

@Injectable()
export class FoodConsumptionService {
  constructor(
    @InjectModel(FoodConsumption)
    private foodConsumptionModel: typeof FoodConsumption,
    @InjectModel(FoodRecord)
    private foodRecordModel: typeof FoodRecord,
    private sequelize: Sequelize,
  ) {}

  async create(
    patientId: string,
    { foodRecords, linkedDay }: RegisterDailyFoodConsumptionDto,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const range: [Date, Date] = [startOfDay(linkedDay), endOfDay(linkedDay)];

      const [foodConsumption] = await this.foodConsumptionModel.findOrCreate({
        where: { linkedDay: { [Op.between]: range }, patientId },
        defaults: { linkedDay, patientId },
        transaction,
      });

      const createdFoodRecords = await this.foodRecordModel.bulkCreate(
        foodRecords.map(({ feedings, mealTime }) => ({
          feedings,
          mealTime,
          foodConsumptionId: foodConsumption.id,
        })),
        { transaction },
      );

      transaction.commit();

      const payload = foodConsumption.toJSON();
      payload.foodRecords = createdFoodRecords.map((foodRecord) =>
        foodRecord.toJSON(),
      );

      return payload;
    } catch (err) {
      transaction.rollback();

      throw err;
    }
  }

  async update(
    patientId: string,
    foodConsumptionId: string,
    { foodRecords }: UpdateDailyFoodConsumptionDto,
  ) {
    const foodConsumption = await this.foodConsumptionModel.findOne({
      where: { patientId, id: foodConsumptionId },
    });

    if (!foodConsumption.id) {
      throw new BadRequestException('Alimentação diária não encontrada');
    }

    const createdFoodRecords = await this.foodRecordModel.bulkCreate(
      foodRecords.map(({ feedings, mealTime }) => ({
        feedings,
        mealTime,
        foodConsumptionId: foodConsumption.id,
      })),
    );

    const payload = foodConsumption.toJSON();
    payload.foodRecords = createdFoodRecords.map((foodRecord) =>
      foodRecord.toJSON(),
    );

    return payload;
  }

  async getByPatient(patientId: string) {
    const foodConsumptions = await this.foodConsumptionModel.findAll({
      where: { patientId },
      include: FoodRecord,
    });

    return foodConsumptions;
  }
}
