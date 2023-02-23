import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isDate } from 'class-validator';
import { UserStorage } from 'src/config/storage/user.storage';
import { ROLE } from 'src/constants/user';
import { Nutritionist } from 'src/models/nutritionist.model';
import { Person } from 'src/models/person.model';
import { AppointmentsService } from '../appointments/appointments.service';
import { AuthService } from '../auth/auth.service';
import { RegisterNutritionistDto } from '../auth/validators/register-nutritionist.dto';
import { PatientService } from '../patient/patient.service';
import { CreateAppointmentDto } from './validators/create-appointment.dto';

@Injectable()
export class NutritionistService {
  constructor(
    @InjectModel(Nutritionist) private nutritionistModel: typeof Nutritionist,
    private patientService: PatientService,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
  ) {}

  async create({ crn, isAdmin = false, ...data }: RegisterNutritionistDto) {
    const nutritionistRole = isAdmin ? ROLE.ADMIN : ROLE.NUTRITIONIST;

    const user = await this.authService.createUser({
      ...data,
      role: nutritionistRole,
    });

    const nutritionist = await this.nutritionistModel.create({
      personId: user.personId,
      crn,
    });

    const token = await this.authService.signPayload({
      email: data.email,
      password: data.password,
    });

    const payload = {
      nutritionist: nutritionist.toJSON(),
      token,
    };

    return payload;
  }

  async getNutritionistByPersonId(personId: string) {
    const nutritionist = await this.nutritionistModel.findOne({
      where: { personId },
    });

    if (!nutritionist) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return nutritionist.toJSON();
  }

  async createAppointment({
    appointmentDate,
    notificationTimes,
    patientId,
  }: CreateAppointmentDto) {
    const user = UserStorage.get();

    const nutritionist = await this.getNutritionistByPersonId(user.personId);

    const appointmentDateNormalized = new Date(appointmentDate);

    if (!isDate(appointmentDateNormalized)) {
      throw new BadRequestException('Data da consulta inválida');
    }

    const patient = await this.patientService.getById(patientId, {
      include: Person,
    });

    const tokens = await this.authService.getPushTokensByUserIds(
      user.id,
      patient.person.user.id,
    );

    const appointment = await this.appointmentsService.create({
      appointmentDate: appointmentDateNormalized,
      minutesBeforeToNotice: notificationTimes,
      patientId: patient.id,
      nutritionistId: nutritionist.id,
      pushTokens: tokens,
    });

    return appointment;
  }
}
