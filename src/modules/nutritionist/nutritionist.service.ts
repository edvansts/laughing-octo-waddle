import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
import { CreateGuidanceDto } from './validators/create-guidance.dto';
import { GuidanceService } from '../guidance/guidance.service';
import { User } from 'src/models/user.model';
import { CreateDailyFoodConsumptionDto } from './validators/create-daily-food-consumption.dto';
import { UpdateDailyFoodConsumptionDto } from './validators/update-daily-food-consumption';
import { FoodConsumptionService } from '../food-consumption/food-consumption.service';

@Injectable()
export class NutritionistService {
  constructor(
    @InjectModel(Nutritionist) private nutritionistModel: typeof Nutritionist,
    private patientService: PatientService,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private userService: UserService,
    private readonly clsService: ClsService<AppStore>,
    private readonly sequelize: Sequelize,
    private readonly guidanceService: GuidanceService,
    private readonly foodConsumptionService: FoodConsumptionService,
  ) {}

  async create({ crn, isAdmin = false, ...data }: RegisterNutritionistDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const { user } = this.clsService.get();
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
    const nutritionist = await this.nutritionistModel.findOne({
      where: { id },
      ...options,
    });

    if (!nutritionist) {
      throw new NotFoundException('Nutricionista não encontrado');
    }

    return nutritionist.toJSON();
  }

  async getByPersonId(
    personId: string,
    options: Omit<FindOptions<Nutritionist>, 'where'> = {},
  ) {
    const nutritionist = await this.nutritionistModel.findOne({
      where: { personId },
      ...options,
    });

    if (!nutritionist) {
      throw new NotFoundException('Nutricionista não encontrado');
    }

    return nutritionist.toJSON();
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
    const { user } = this.clsService.get();

    const nutritionist = await this.getById(nutritionistId, {
      include: { model: Person, include: [User] },
    });

    if (nutritionist.person.user.id !== user.id) {
      throw new BadRequestException('Nutricionista inválido');
    }

    const patient = await this.patientService.getById(patientId, {
      include: Person,
    });

    const patientUser = await this.userService.getByPersonId(patient.personId);

    const userIds = [user.id, patientUser.id];

    const appointment = await this.appointmentsService.create({
      appointmentDate,
      minutesBeforeToNotice: notificationTimes,
      patientId: patient.id,
      nutritionistId: nutritionist.id,
      userIds,
      patientName: patient.person.name,
      nutritionistName: nutritionist.person.name,
      emails: [user.email, patientUser.email],
    });

    return appointment;
  }

  async createGuidance(
    nutritionistId: string,
    { nutritionalGuidance, patientId }: CreateGuidanceDto,
  ) {
    const { user } = this.clsService.get();

    const nutritionist = await this.getById(nutritionistId, {
      include: { model: Person, include: [User] },
    });

    if (nutritionist.person.user.id !== user.id) {
      throw new BadRequestException('Nutricionista inválido');
    }

    const patient = await this.patientService.getById(patientId, {
      include: { model: Person, include: [User] },
    });

    const guidance = await this.guidanceService.create({
      nutritionalGuidance,
      patientId: patient.id,
      nutritionistId,
      patientUserId: patient.person.user.id,
    });

    return guidance;
  }

  async createDailyFoodConsumption(
    patientId: string,
    data: CreateDailyFoodConsumptionDto,
  ) {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    const nutritionist = await this.getByByPersonId(user.personId);

    return this.foodConsumptionService.create(
      patient.id,
      nutritionist.id,
      data,
    );
  }

  async updateDailyFoodConsumption(
    patientId: string,
    foodConsumptionId: string,
    data: UpdateDailyFoodConsumptionDto,
  ) {
    const patient = await this.getById(patientId);

    return this.foodConsumptionService.update(
      patient.id,
      foodConsumptionId,
      data,
    );
  }
}
