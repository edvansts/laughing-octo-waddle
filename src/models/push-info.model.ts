import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class PushInfo extends Model<PushInfo> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: new Date() })
  lastCheckInAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
