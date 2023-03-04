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

  @Column({ type: DataType.STRING })
  hemoglobin: string;

  @Column({ type: DataType.STRING })
  hematocrit: string;

  @Column({ type: DataType.STRING })
  rbcs: string;

  @Column({ type: DataType.STRING })
  platelets: string;

  @Column({ type: DataType.STRING })
  leukocytes: string;

  @Column({ type: DataType.STRING })
  totalCholesterol: string;

  @Column({ type: DataType.STRING })
  ldl: string;

  @Column({ type: DataType.STRING })
  hdl: string;

  @Column({ type: DataType.STRING })
  vldl: string;

  @Column({ type: DataType.STRING })
  triglycerides: string;

  @Column({ type: DataType.STRING })
  totalLipids: string;

  @Column({ type: DataType.STRING })
  totalProteins: string;

  @Column({ type: DataType.STRING })
  preAlbumin: string;

  @Column({ type: DataType.STRING })
  albumin: string;

  @Column({ type: DataType.STRING })
  globulin: string;

  @Column({ type: DataType.STRING })
  fastingGlucose: string;

  @Column({ type: DataType.STRING })
  postprandialGlucose: string;

  @Column({ type: DataType.STRING })
  hemoglobinGlycad: string;

  @Column({ type: DataType.STRING })
  tgo: string;

  @Column({ type: DataType.STRING })
  tgp: string;

  @Column({ type: DataType.STRING })
  ggt: string;

  @Column({ type: DataType.STRING })
  cpk: string;

  @Column({ type: DataType.STRING })
  Calcium: string;

  @Column({ type: DataType.STRING })
  ionizedCalcium: string;

  @Column({ type: DataType.STRING })
  phosphorus: string;

  @Column({ type: DataType.STRING })
  tsh: string;

  @Column({ type: DataType.STRING })
  t4l: string;

  @Column({ type: DataType.STRING })
  totalBilirubin: string;

  @Column({ type: DataType.STRING })
  directBilirubin: string;

  @Column({ type: DataType.STRING })
  inr: string;

  @Column({ type: DataType.STRING })
  alt: string;

  @Column({ type: DataType.STRING })
  ast: string;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
