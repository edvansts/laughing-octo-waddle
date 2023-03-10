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
export class BodyEvolution extends Model<BodyEvolution> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  uploadDate: Date;

  @Column({ type: DataType.STRING })
  publicId: string;

  @Column({ type: DataType.STRING })
  imageUrl: string;

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
