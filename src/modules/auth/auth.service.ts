import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NutritionistService } from '../nutritionist/nutritionist.service';
import { PatientService } from '../patient/patient.service';
import { UserService } from '../user/user.service';
import { SignPayload, TokenData } from './types';
import { LoginDto } from './validators/login.dto';
import { RegisterNutritionistDto } from './validators/register-nutritionist.dto';
import { RegisterPatientDto } from './validators/register-patient.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private nutritionistService: NutritionistService,
    private patientService: PatientService,
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

  async createNutritionist({
    crn,
    email,
    name,
    password,
    cpf,
  }: RegisterNutritionistDto) {
    const nutritionist = await this.nutritionistService.create({
      cpf,
      crn,
      email,
      name,
      password,
    });

    const token = await this.signPayload({ email, password });

    const payload = {
      nutritionist,
      token,
    };

    return payload;
  }

  async createPatient({ email, name, password, cpf }: RegisterPatientDto) {
    const nutritionist = await this.patientService.create({
      cpf,
      email,
      name,
      password,
    });

    const token = await this.signPayload({ email, password });

    const payload = {
      nutritionist,
      token,
    };

    return payload;
  }
}
