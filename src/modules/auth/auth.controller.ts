import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/config/decorators/is-public.decorator';
import { Roles } from 'src/config/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { ROLE } from 'src/constants/user';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './responses/login-response.dto';
import { LoginDto } from './validators/login.dto';
import { RegisterNutritionistDto } from './validators/register-nutritionist.dto';

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

  @Post('register/nutritionist')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  @Roles(ROLE.ADMIN)
  async createNutritionist(@Body() nutritionist: RegisterNutritionistDto) {
    return this.authService.createNutritionist(nutritionist);
  }

  @Post('register/patient')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: User })
  @Roles(ROLE.NUTRITIONIST, ROLE.ADMIN)
  async createPatient(@Body() nutritionist: RegisterNutritionistDto) {
    return this.authService.createPatient(nutritionist);
  }
}
