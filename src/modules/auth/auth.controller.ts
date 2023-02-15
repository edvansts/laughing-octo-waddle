import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './validators/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }
}
