import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { AuthService } from './auth.service';
import { LoginDto } from './validators/login.dto';
import { RegisterNutritionistDto } from './validators/register-nutritionist.dto';

@ApiTags('auth')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('register/nutritionist')
  @ApiBearerAuth()
  @Roles(ROLE.ADMIN)
  async createNutritionist(@Body() nutritionist: RegisterNutritionistDto) {
    return this.authService.createNutritionist(nutritionist);
  }
}
