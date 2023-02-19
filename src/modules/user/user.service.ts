import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcrypt';
import { isEmail, isObject } from 'class-validator';
import { Op } from 'sequelize';
import { ROLE } from 'src/constants/user';
import { User } from 'src/models/user.model';
import { isValidCPF } from 'src/utils/validation';
import { PersonService } from '../person/person.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
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

  async create({
    email,
    cpf,
    name,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: ROLE;
    name: string;
    cpf: string;
  }) {
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
}
