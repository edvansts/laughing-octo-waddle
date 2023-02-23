import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { PRIORITY } from 'src/constants/enum';

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
  scheduleDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('pushTokens'));
    },
    set: function (value) {
      this.setDataValue('pushTokens', JSON.stringify(value));
    },
    defaultValue: JSON.stringify([]),
  })
  pushTokens: string[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSended: boolean;

  @Column({ type: DataType.DATE })
  sendedAt?: Date;

  @Column({ type: DataType.STRING })
  title?: string;

  @Column({ type: DataType.STRING })
  subtitle?: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PRIORITY),
    defaultValue: PRIORITY.NORMAL,
  })
  priority: PRIORITY;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    get: function () {
      return JSON.parse(this.getDataValue('data'));
    },
    set: function (value) {
      this.setDataValue('data', JSON.stringify(value));
    },
    defaultValue: JSON.stringify({}),
  })
  data: object;
}
