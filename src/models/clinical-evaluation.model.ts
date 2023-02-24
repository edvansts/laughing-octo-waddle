import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import {
  ALCOHOLIC_STATUS,
  CLINICAL_HISTORY,
  EATING_BEHAVIOR,
  ENVIRONMENT,
  FAMILIAR_BACKGROUND,
  SMOKER_STATUS,
  SYMPTOM,
} from 'src/constants/enum';
import { Patient } from './patient.model';

@Table
export class ClinicalEvaluation extends Model<ClinicalEvaluation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING })
  medicationsAndSupplementsUsed?: string;

  @Column({ type: DataType.STRING })
  weightLossTreatmentsPerformed?: string;

  @Column({ type: DataType.ENUM, values: Object.values(SMOKER_STATUS) })
  smokerStatus: SMOKER_STATUS;

  @Column({ type: DataType.STRING })
  smokerDescription?: string;

  @Column({ type: DataType.ENUM, values: Object.values(ALCOHOLIC_STATUS) })
  alcoholicStatus: ALCOHOLIC_STATUS;

  @Column({ type: DataType.STRING })
  alcoholicDescription?: string;

  @Column({ type: DataType.STRING })
  physicalActivityDescription?: string;

  @Column({ type: DataType.STRING })
  spareTimeDescription?: string;

  @Column({ type: DataType.ENUM, values: Object.values(EATING_BEHAVIOR) })
  eatingBehavior: EATING_BEHAVIOR;

  @Column({ type: DataType.STRING })
  mainMealsAndSnacksPlaces: string;

  @Column({ type: DataType.ENUM, values: Object.values(ENVIRONMENT) })
  mainMealsEnvironment: ENVIRONMENT;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('familiarBackgroud'));
    },
    set: function (value) {
      this.setDataValue('familiarBackgroud', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  familiarBackground: FAMILIAR_BACKGROUND[];

  @Column({ type: DataType.STRING })
  otherFamiliarBackgrounds?: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('clinicalHistory'));
    },
    set: function (value) {
      this.setDataValue('clinicalHistory', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  clinicalHistory: CLINICAL_HISTORY[];

  @Column({ type: DataType.STRING })
  otherClinicalHistories?: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('reportedSymptoms'));
    },
    set: function (value) {
      this.setDataValue('reportedSymptoms', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  reportedSymptoms: SYMPTOM[];

  @ForeignKey(() => Patient)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  patientId: string;

  @BelongsTo(() => Patient)
  patient: Patient;
}
