import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcrypt';
import { isEmail, isObject } from 'class-validator';
import { Op } from 'sequelize';
import { UserStorage } from 'src/config/storage/user.storage';
import { PushNotificationToken } from 'src/models/push-notification-token.moduel';
import { User } from 'src/models/user.model';
import { isValidCPF } from 'src/utils/validation';
import { PersonService } from '../person/person.service';
import { CreateUserDto } from './validators/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(PushNotificationToken)
    private pushNotificationTokenModel: typeof PushNotificationToken,
    private personService: PersonService,
  ) {}

  async findByLogin(userData: { email: string; password: string }) {
    const { email, password } = userData;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Usuário não existe');
    }

    const isPasswordCorrectly = await compare(password, user.password);

    if (!isPasswordCorrectly) {
      throw new BadRequestException('Senha incorreta');
    }

    return this.normalizeUser(user);
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return this.normalizeUser(user);
  }

  private normalizeUser(user: User) {
    const jsonUser = user.toJSON();

    delete jsonUser.password;

    return jsonUser;
  }

  async create({ email, cpf, name, password, role }: CreateUserDto) {
    try {
      const alreadyCreatedPerson = await this.personService.findByCpf(cpf);

      const alreadyCreatedUser = await this.userModel.findOne({
        where: {
          [Op.or]: { personId: alreadyCreatedPerson?.id || null, email },
        },
      });

      if (isObject(alreadyCreatedUser)) {
        throw new Error('CPF inválido');
      }

      if (!isValidCPF(cpf)) {
        throw new Error('CPF inválido');
      }

      if (!isEmail(email)) {
        throw new Error('Email inválido');
      }

      const newPerson =
        alreadyCreatedPerson ||
        (await this.personService.create({ cpf, name }));

      const newUser = await this.userModel.create({
        password,
        role,
        personId: newPerson.id,
        email,
      });

      return newUser;
    } catch (error) {
      throw new BadRequestException(Error(error).message);
    }
  }

  async checkIn({ pushNotificationToken }: { pushNotificationToken: string }) {
    try {
      const user = UserStorage.get();

      if (
        user.pushNotificationTokens.some(
          ({ token }) => token === pushNotificationToken,
        )
      ) {
        return;
      }

      await this.pushNotificationTokenModel.create({
        token: pushNotificationToken,
        userId: user.id,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getPushTokensByUserIds(...userIds: string[]) {
    const pushNotificationTokens =
      await this.pushNotificationTokenModel.findAll({
        where: { id: { [Op.in]: userIds } },
      });

    const tokens = pushNotificationTokens.map(({ token }) => token);

    return tokens;
  }
}
