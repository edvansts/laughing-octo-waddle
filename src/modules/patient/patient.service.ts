import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import { ClsService } from 'nestjs-cls';
import { Op } from 'sequelize';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ROLE } from 'src/constants/user';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { Patient } from 'src/models/patient.model';
import { Person } from 'src/models/person.model';
import { PhysicalEvaluation } from 'src/models/physical-evaluation.model';
import { AppStore } from 'src/types/services';
import { AuthService } from '../auth/auth.service';
import { FoodConsumptionService } from '../food-consumption/food-consumption.service';
import { UserService } from '../user/user.service';
import { CreatePhysicalEvaluationDto } from './validators/create-physical-evaluation';
import { RegisterClinicalEvaluationDto } from './validators/register-clinical-evaluation.dto';
import { RegisterDailyFoodConsumptionDto } from './validators/register-daily-food-consumption.dto';
import { RegisterPatientDto } from './validators/register-patient.dto';
import { UpdateDailyFoodConsumptionDto } from './validators/update-daily-food-consumption';
import { UpdatePatientDto } from './validators/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    @InjectModel(ClinicalEvaluation)
    private clinicalEvaluationModel: typeof ClinicalEvaluation,
    @InjectModel(PhysicalEvaluation)
    private physicalEvaluationModel: typeof PhysicalEvaluation,
    private foodConsumptionService: FoodConsumptionService,
    private authService: AuthService,
    private userService: UserService,
    private readonly clsService: ClsService<AppStore>,
    private sequelize: Sequelize,
  ) {}

  async create({
    email,
    password,
    cpf,
    name,
    ...patientData
  }: RegisterPatientDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userService.create(
        {
          email,
          cpf,
          name,
          password,
          role: ROLE.PATIENT,
        },
        transaction,
      );

      const patient = await this.patientModel.create(
        {
          ...patientData,
          personId: user.personId,
        },
        { include: Person, transaction },
      );

      const token = await this.authService.signPayload({
        email,
        password,
      });

      const payload = {
        patient: patient.toJSON(),
        token,
      };

      transaction.commit();

      return payload;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  private isSamePatientAsUser(patient: Patient) {
    const { user } = this.clsService.get();

    if (user.role === ROLE.PATIENT && patient.personId !== user.personId) {
      return false;
    }

    return true;
  }

  private async update(patientId: string, patient: UpdatePatientDto) {
    try {
      const [affectCount] = await this.patientModel.update(
        { ...patient },
        {
          where: { id: patientId },
        },
      );

      if (affectCount === 0) {
        throw new Error('Paciente inválido');
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updatePatient(patientId: string, patientData: UpdatePatientDto) {
    const patient = await this.getById(patientId);

    if (!this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    await this.update(patientId, patientData);
  }

  async getById(id: string, options: Omit<FindOptions<Patient>, 'where'> = {}) {
    const patient = await this.patientModel.findOne({
      where: { id },
      ...options,
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient.toJSON();
  }

  async getPatientByPersonId(personId: string) {
    const patient = await this.patientModel.findOne({ where: { personId } });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient.toJSON();
  }

  async getClinicalEvaluationById(patientId: string) {
    const patient = await this.getById(patientId, {
      include: ClinicalEvaluation,
    });

    if (!this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return patient.clinicalEvaluation;
  }

  async createClinicalEvaluation(
    patientId: string,
    clinicalEvaluation: RegisterClinicalEvaluationDto,
  ) {
    const patient = await this.getById(patientId);

    const newClinicalEvaluation = await this.clinicalEvaluationModel.create({
      ...clinicalEvaluation,
      patientId: patient.id,
    });

    return newClinicalEvaluation;
  }

  async createDailyFoodConsumption(
    patientId: string,
    data: RegisterDailyFoodConsumptionDto,
  ) {
    const patient = await this.getById(patientId);

    if (!this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.foodConsumptionService.create(patient.id, data);
  }

  async updateDailyFoodConsumption(
    patientId: string,
    foodConsumptionId: string,
    data: UpdateDailyFoodConsumptionDto,
  ) {
    const patient = await this.getById(patientId);

    if (!this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.foodConsumptionService.update(
      patient.id,
      foodConsumptionId,
      data,
    );
  }

  async getDailyFoodConsumptions(patientId: string) {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId, {
      include: ClinicalEvaluation,
    });

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.foodConsumptionService.getByPatient(patient.id);
  }

  async createPhysicalEvaluation(
    patientId: string,
    data: CreatePhysicalEvaluationDto,
  ) {
    const patient = await this.getById(patientId);

    const physicalEvaluation = await this.physicalEvaluationModel.create({
      ...data,
      patientId: patient.id,
    });

    return physicalEvaluation;
  }

  async getPhysicalEvaluations(patientId: string) {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId, {
      include: ClinicalEvaluation,
    });

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    const physicalEvaluations = await this.physicalEvaluationModel.findAll({
      where: { patientId: patient.id },
    });

    return physicalEvaluations;
  }

  async checkSendDailyFoodConsumptions() {
    const todayRange: [Date, Date] = [
      startOfDay(new Date()),
      endOfDay(new Date()),
    ];

    const patients = await this.patientModel.findAll({
      attributes: [
        [
          this.sequelize.fn('COUNT', 'foodConsumptions.id'),
          'foodConsumptionsCount',
        ],
      ],
      where: {
        [Op.or]: [
          {
            [Op.not]: {
              '$foodConsumptions.linkedDay$': {
                [Op.between]: todayRange,
              },
            },
          },
        ],
      },
      group: ['foodConsumptions.id'],
      include: {
        model: FoodConsumption,
        attributes: [
          [
            this.sequelize.fn(
              'COUNT',
              this.sequelize.col('foodConsumptions.id'),
            ),
            'foodConsumptionsCount',
          ],
        ],
      },
    });

    return patients;
  }
}
