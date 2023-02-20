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

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
