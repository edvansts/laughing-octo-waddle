import { ApiExtraModels } from '@nestjs/swagger';
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
import { CIVIL_STATUS, GENDER, SEX } from 'src/constants/enum';
import { Person } from './person.model';
import { PhysicalEvaluation } from './physical-evaluation.model';
import { BR_PHONE_REGEX } from 'src/constants/regex';

@ApiExtraModels()
@Table
export class Patient extends Model<Patient> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  birthdayDate: Date;

  @Column({ type: DataType.ENUM, values: Object.values(SEX), allowNull: false })
  sex: SEX;

  @Column({
    type: DataType.ENUM,
    values: Object.values(GENDER),
    allowNull: false,
  })
  gender: GENDER;

  @Column({
    type: DataType.ENUM,
    values: Object.values(CIVIL_STATUS),
    allowNull: false,
  })
  civilStatus: CIVIL_STATUS;

  @Column({ type: DataType.STRING })
  nationality: string;

  @Column({ type: DataType.STRING })
  naturality: string;

  @Column({ type: DataType.STRING })
  ethnicity: string;

  @Column({ type: DataType.STRING })
  schooling: string;

  @Column({ type: DataType.STRING })
  profession: string;

  @Column({ type: DataType.STRING })
  completeAddress: string;

  @Column({
    type: DataType.STRING,
    validate: { is: BR_PHONE_REGEX },
  })
  phoneNumber: string;

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
