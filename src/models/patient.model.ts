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
import { Appointment } from './appointment.model';
import { ClinicalEvaluation } from './clinical-evaluation.model';
import { Diagnostic } from './diagnostic.model';
import { Person } from './person.model';
import { PhysicalEvaluation } from './physical-evaluation.model';

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
