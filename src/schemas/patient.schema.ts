import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Appointment } from './appointment.schema';
import { ClinicalEvaluation } from './clinical-evaluation.schema';
import { Diagnostic } from './diagnostic.schema';
import { Person } from './person.schema';
import { PhysicalEvaluation } from './physical-evaluation.schema';

@Table
export class Patient extends Model<Patient> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  personId: string;

  @BelongsTo(() => Person)
  person: Person;

  @HasMany(() => Diagnostic)
  diagnostics: Diagnostic[];

  @HasMany(() => Appointment)
  appointments: Appointment[];

  @HasMany(() => PhysicalEvaluation)
  physicalEvaluation: PhysicalEvaluation[];

  @HasOne(() => ClinicalEvaluation)
  clinicalEvaluation: ClinicalEvaluation;
}
