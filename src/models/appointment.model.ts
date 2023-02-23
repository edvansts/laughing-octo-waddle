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
export class Appointment extends Model<Appointment> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  appointmentDate: Date;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;

  @ForeignKey(() => Nutritionist)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  nutritionistId: string;
}
