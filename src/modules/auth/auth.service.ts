import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/validators/create-user.dto';
import { SignPayload, TokenData } from './types';
import { CheckInDto } from './validators/check-in.dto';
import { LoginDto } from './validators/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signPayload(payload: SignPayload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: LoginDto) {
    return await this.userService.findByLogin(payload);
  }

  async validateTokenData({ email }: TokenData) {
    return await this.userService.findByEmail(email);
  }

  async login(data: LoginDto) {
    const user = await this.userService.findByLogin(data);

    const token = await this.signPayload(data);

    return {
      user,
      token,
    };
  }

  async createUser(data: CreateUserDto) {
    return this.userService.create(data);
  }

  async checkIn(data: CheckInDto) {
    return this.userService.checkIn(data);
  }

  async getPushTokensByUserIds(...userIds: string[]) {
    return this.userService.getPushTokensByUserIds(...userIds);
  }
}
