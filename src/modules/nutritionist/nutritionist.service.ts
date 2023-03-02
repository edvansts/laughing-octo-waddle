import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isDate } from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { ROLE } from 'src/constants/user';
import { Nutritionist } from 'src/models/nutritionist.model';
import { Person } from 'src/models/person.model';
import { AppStore } from 'src/types/services';
import { AppointmentsService } from '../appointments/appointments.service';
import { AuthService } from '../auth/auth.service';
import { RegisterNutritionistDto } from './validators/register-nutritionist.dto';
import { PatientService } from '../patient/patient.service';
import { UserService } from '../user/user.service';
import { CreateAppointmentDto } from './validators/create-appointment.dto';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class NutritionistService {
  constructor(
    @InjectModel(Nutritionist) private nutritionistModel: typeof Nutritionist,
    private patientService: PatientService,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private userService: UserService,
    private readonly cls: ClsService<AppStore>,
    private readonly sequelize: Sequelize,
  ) {}

  async create({ crn, isAdmin = false, ...data }: RegisterNutritionistDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const { user } = this.cls.get();
      const nutritionistRole =
        isAdmin && user.role === ROLE.ADMIN ? ROLE.ADMIN : ROLE.NUTRITIONIST;

      const newUser = await this.userService.create(
        {
          ...data,
          role: nutritionistRole,
        },
        transaction,
      );

      const nutritionist = await this.nutritionistModel.create(
        {
          personId: newUser.personId,
          crn,
        },
        { include: Person, transaction },
      );

      const token = await this.authService.signPayload({
        email: data.email,
        password: data.password,
      });

      const payload = {
        nutritionist: nutritionist.toJSON(),
        token,
      };

      transaction.commit();

      return payload;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  async getById(
    id: string,
    options: Omit<FindOptions<Nutritionist>, 'where'> = {},
  ) {
    const patient = await this.nutritionistModel.findOne({
      where: { id },
      ...options,
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient.toJSON();
  }

  async getByByPersonId(personId: string) {
    const nutritionist = await this.nutritionistModel.findOne({
      where: { personId },
    });

    if (!nutritionist) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return nutritionist.toJSON();
  }

  async createAppointment(
    nutritionistId: string,
    { appointmentDate, notificationTimes, patientId }: CreateAppointmentDto,
  ) {
    const { user } = this.cls.get();

    const nutritionist = await this.getById(nutritionistId);

    if (nutritionist.id !== user.id) {
      throw new BadRequestException('Nutricionista inválido');
    }

    const appointmentDateNormalized = new Date(appointmentDate);

    if (!isDate(appointmentDateNormalized)) {
      throw new BadRequestException('Data da consulta inválida');
    }

    const patient = await this.patientService.getById(patientId);

    const patientUser = await this.userService.getByPersonId(patient.personId);

    const userIds = [user.id, patientUser.id];

    const appointment = await this.appointmentsService.create({
      appointmentDate: appointmentDateNormalized,
      minutesBeforeToNotice: notificationTimes,
      patientId: patient.id,
      nutritionistId: nutritionist.id,
      userIds,
    });

    return appointment;
  }
}
