import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStorage } from 'src/config/storage/user.storage';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.USER_AUTH_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { email: string; username: string }) {
    const user = await this.authService.validateTokenData(payload);

    if (!user) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }

    UserStorage.set(user);

    return user;
  }
}
