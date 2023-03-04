import { ApiExtraModels } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Patient } from './patient.model';

@ApiExtraModels()
@Table
export class AnthropometricEvaluation extends Model<AnthropometricEvaluation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.NUMBER })
  weight: number;

  @Column({ type: DataType.NUMBER })
  dryWeight: number;

  @Column({ type: DataType.NUMBER })
  bmi: number;

  @Column({ type: DataType.NUMBER })
  height: number;

  @Column({ type: DataType.NUMBER })
  waistCircumference: number;

  @Column({ type: DataType.NUMBER })
  abdominalCircumference: number;

  @Column({ type: DataType.NUMBER })
  hipCircumference: number;

  @Column({ type: DataType.NUMBER })
  armCircumference: number;

  @Column({ type: DataType.NUMBER })
  rightWrist: number;

  @Column({ type: DataType.NUMBER })
  neckCircumference: number;

  @Column({ type: DataType.DATE, allowNull: false })
  examDate: Date;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
