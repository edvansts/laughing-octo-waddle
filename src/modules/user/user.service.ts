import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcrypt';
import { isEmail, isObject } from 'class-validator';
import { Op } from 'sequelize';
import { UserStorage } from 'src/config/storage/user.storage';
import { PushInfo } from 'src/models/push-info.model';
import { User } from 'src/models/user.model';
import { isValidCPF } from 'src/utils/validation';
import { CheckInDto } from '../auth/validators/check-in.dto';
import { PersonService } from '../person/person.service';
import { CreateUserDto } from './validators/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(PushInfo)
    private pushInfoModel: typeof PushInfo,
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

  private async getUserPushInfos(...userIds: string[]) {
    const pushInfos = await this.pushInfoModel.findAll({
      where: { id: { [Op.in]: userIds } },
    });

    return pushInfos;
  }

  async checkIn({ pushToken }: CheckInDto) {
    try {
      const user = UserStorage.get();

      const pushInfos = await this.getUserPushInfos(user.id);

      if (pushInfos.length === 0) {
        return;
      }

      const existsPushInfo = pushInfos.find(({ token }) => token === pushToken);

      if (existsPushInfo) {
        existsPushInfo.update({ lastCheckInAt: new Date() });
        return;
      }

      await this.pushInfoModel.create({
        token: pushToken,
        userId: user.id,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getPushTokensByUserIds(...userIds: string[]) {
    const pushInfos = this.getPushTokensByUserIds(...userIds);

    const tokens = pushInfos.map(({ token }) => token);

    return tokens;
  }
}
