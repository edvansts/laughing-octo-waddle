import { ApiExtraModels } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Appointment } from './appointment.model';
import { Diagnostic } from './diagnostic.model';
import { FoodConsumption } from './food-consumption.model';
import { Person } from './person.model';

@ApiExtraModels()
@Table
export class Nutritionist extends Model<Nutritionist> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  crn: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  personId: string;

  @BelongsTo(() => Person)
  person: Person;

  @HasMany(() => Diagnostic)
  diagnostics: Diagnostic[];

  @HasMany(() => Appointment)
  appointments: Appointment[];

  @HasMany(() => FoodConsumption)
  foodConsumptions: FoodConsumption[];
}
