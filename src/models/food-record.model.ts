import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Feeding } from 'src/types/food';
import { FoodConsumption } from './food-consumption.model';

@Table
export class FoodRecord extends Model<FoodRecord> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  mealTime: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('feedings'));
    },
    set: function (value) {
      this.setDataValue('feedings', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  feedings: Feeding[];

  @ForeignKey(() => FoodConsumption)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  foodConsumptionId: string;

  @BelongsTo(() => FoodConsumption)
  foodConsumption: FoodConsumption;
}
