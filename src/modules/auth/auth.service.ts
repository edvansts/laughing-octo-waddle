import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignPayload, TokenData } from './types';
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
    return this.userService.findByLogin(data);
  }
}
