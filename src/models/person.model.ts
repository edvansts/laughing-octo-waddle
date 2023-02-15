import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { Nutritionist } from './nutritionist.model';
import { Patient } from './patient.model';
import { User } from './user.model';

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

  @Column({ type: DataType.STRING, unique: true })
  cpf: string;

  @HasOne(() => Nutritionist)
  nutritionist?: Nutritionist;

  @HasOne(() => Patient)
  patient?: Patient;

  @HasOne(() => User)
  user?: User;
}
