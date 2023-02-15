import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcrypt';
import { User } from 'src/models/user.model';
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
}
