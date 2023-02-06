import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Nutritionist } from './nutritionist.schema';
import { Patient } from './patient.schema';

@Table
export class Guidance extends Model<Guidance> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;

  @ForeignKey(() => Nutritionist)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  nutritionistId: string;

  @BelongsTo(() => Nutritionist)
  nutritionist: Nutritionist;
}
