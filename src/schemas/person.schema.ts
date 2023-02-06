import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { Nutritionist } from './nutritionist.schema';

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
  nutritionist: Nutritionist;
}
