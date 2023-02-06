import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public';
import { AuthService } from './auth.service';
import { LoginBody } from './validators/login';
import { RegisterBody } from './validators/register';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() userData: RegisterBody) {
    // return this.authService.register(loginDto);
  }

  @Post('login')
  @Public()
  async login(@Body() userDto: LoginBody) {
    // return this.authService.login(userDto);
  }
}
