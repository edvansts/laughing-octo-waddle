import { ApiExtraModels, ApiHideProperty } from '@nestjs/swagger';
import { genSalt, hash } from 'bcrypt';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeSave,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { ROLE } from 'src/constants/user';
import { Person } from './person.model';
import { PushInfo } from './push-info.model';

@ApiExtraModels()
@Table
class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: false,
  })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ROLE)),
    defaultValue: ROLE.NUTRITIONIST,
  })
  role: ROLE;

  @ApiHideProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  @Index('email')
  email: string;

  @ForeignKey(() => Person)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  personId: string;

  @BelongsTo(() => Person)
  person: Person;

  @ApiHideProperty()
  @HasMany(() => PushInfo)
  pushInfos: PushInfo[];

  @BeforeSave
  static async normalizePassword(instance: User) {
    if (instance.password) {
      const salt = await genSalt(10, 'a');
      instance.password = await hash(instance.password, salt);
    }
  }
}

export { User };
