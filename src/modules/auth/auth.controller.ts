import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './responses/login-response.dto';
import { CheckInDto } from './validators/check-in.dto';
import { LoginDto } from './validators/login.dto';

@ApiTags('auth')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @Public()
  async login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('check-in')
  @ApiBearerAuth()
  @ApiNoContentResponse()
  async checkIn(@Body() data: CheckInDto) {
    return this.authService.checkIn(data);
  }
}
