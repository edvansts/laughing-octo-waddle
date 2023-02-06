import { genSalt, hash } from 'bcrypt';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ROLES } from 'src/constants/user';
import { Person } from './person.schema';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({ type: DataType.ENUM(...Object.values(ROLES)) })
  role: ROLES;

  @Column({ type: DataType.STRING })
  password: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  personId: string;

  @BelongsTo(() => Person)
  person: Person;
}

User.beforeSave(async (user) => {
  if (user.password) {
    const salt = await genSalt(10, 'a');
    user.password = await hash(user.password, salt);
  }
});
