import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { Nutritionist } from './nutritionist.schema';
import { Patient } from './patient.schema';
import { User } from './user.schema';

@Table
export class Person extends Model<Person> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING })
  name: string;

  @HasOne(() => Nutritionist)
  nutritionist?: Nutritionist;

  @HasOne(() => Patient)
  patient?: Patient;

  @HasOne(() => User)
  user?: User;
}
