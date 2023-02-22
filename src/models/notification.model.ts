import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Appointment } from './appointment.model';

@Table
export class Notification extends Model<Notification> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.DATE })
  scheduleTime: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('pushNotificationTokens'));
    },
    set: function (value) {
      this.setDataValue('pushNotificationTokens', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  pushNotificationTokens: string[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSended: boolean;

  @Column({ type: DataType.DATE })
  sendedAt?: Date;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  appointmentId: string;

  @BelongsTo(() => Appointment)
  appointment: Appointment;
}
