import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignPayload, TokenData } from './types';
import { LoginBody } from './validators/login';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signPayload(payload: SignPayload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: LoginBody) {
    // return await this.userService.findByPayload(payload);
    return true;
  }

  async validateTokenData(payload: TokenData) {
    // return await this.userService.findByKeys(payload);
    return true;
  }
}
