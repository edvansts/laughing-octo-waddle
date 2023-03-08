import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Nutritionist } from './nutritionist.model';
import { Patient } from './patient.model';

@Table
export class Guidance extends Model<Guidance> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING })
  nutritionalGuidance: string;

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
