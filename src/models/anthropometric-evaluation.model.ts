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

@Table
export class AnthropometricEvaluation extends Model<AnthropometricEvaluation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DECIMAL(8, 2) })
  weight: number;

  @Column({ type: DataType.DECIMAL(8, 2) })
  dryWeight: number;

  @Column({ type: DataType.DECIMAL(8, 2) })
  bmi: number;

  @Column({ type: DataType.INTEGER() })
  height: number;

  @Column({ type: DataType.INTEGER() })
  waistCircumference: number;

  @Column({ type: DataType.INTEGER() })
  abdominalCircumference: number;

  @Column({ type: DataType.INTEGER() })
  hipCircumference: number;

  @Column({ type: DataType.INTEGER() })
  armCircumference: number;

  @Column({ type: DataType.INTEGER() })
  rightWrist: number;

  @Column({ type: DataType.INTEGER() })
  neckCircumference: number;

  @Column({ type: DataType.DATE, allowNull: false })
  examDate: Date;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
