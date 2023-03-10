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
export class PhysicalEvaluation extends Model<PhysicalEvaluation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING })
  hair: string;

  @Column({ type: DataType.STRING })
  bichartBalls: string;

  @Column({ type: DataType.STRING })
  facialSkin: string;

  @Column({ type: DataType.STRING })
  lips: string;

  @Column({ type: DataType.STRING })
  tongue: string;

  @Column({ type: DataType.STRING })
  eyes: string;

  @Column({ type: DataType.STRING })
  trunkSkin: string;

  @Column({ type: DataType.STRING })
  nails: string;

  @Column({ type: DataType.STRING })
  armpits: string;

  @Column({ type: DataType.STRING })
  upperLimbs: string;

  @Column({ type: DataType.STRING })
  lowerLimbsLegs: string;

  @Column({ type: DataType.STRING })
  lowerLimbsFeet: string;

  @Column({ type: DataType.STRING })
  otherInformations?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  examDate: Date;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
