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
export class BiochemicalEvaluation extends Model<BiochemicalEvaluation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  hemoglobin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  hematocrit: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  rbcs: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  platelets: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  leukocytes: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  totalCholesterol: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  ldl: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  hdl: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  vldl: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  triglycerides: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  totalLipids: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  totalProteins: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  preAlbumin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  albumin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  globulin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  fastingGlucose: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  postprandialGlucose: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  hemoglobinGlycad: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  tgo: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  tgp: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  ggt: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  cpk: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  calcium: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  ionizedCalcium: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  phosphorus: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  tsh: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  t4l: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  totalBilirubin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  directBilirubin: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  inr: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  alt: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  ast: string;

  @Column({ type: DataType.DATE, allowNull: false })
  examDate: Date;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
