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
import { BiochemicalEvaluation } from 'src/models/biochemical-evaluation.model';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { FoodConsumption } from 'src/models/food-consumption.model';
import { Patient } from 'src/models/patient.model';
import { Person } from 'src/models/person.model';
import { PhysicalEvaluation } from 'src/models/physical-evaluation.model';
import { AppStore } from 'src/types/services';
import { AuthService } from '../auth/auth.service';
import { PaginatedResponse } from '../common/response/paginated.response';
import { PaginationDto } from '../common/validators/pagination.dto';
import { FoodConsumptionService } from '../food-consumption/food-consumption.service';
import { UserService } from '../user/user.service';
import { CreateBiochemicalEvaluationDto } from './validators/create-biochemical-evaluation.dto';
import { CreatePhysicalEvaluationDto } from './validators/create-physical-evaluation.dto';
import { CreateClinicalEvaluationDto } from './validators/create-clinical-evaluation.dto';
import { CreatePatientDto } from './validators/create-patient.dto';
import { UpdatePatientDto } from './validators/update-patient.dto';
import { AnthropometricEvaluation } from 'src/models/anthropometric-evaluation.model';
import { CreateAnthropometricEvaluationDto } from './validators/create-anthropometric-evaluation.dto';
import { GuidanceService } from '../guidance/guidance.service';
import { RegisterHistoryWeightGainDto } from './validators/register-history-weight-gain.dto';
import { BodyEvolutionService } from '../body-evolution/body-evolution.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    @InjectModel(ClinicalEvaluation)
    private clinicalEvaluationModel: typeof ClinicalEvaluation,
    @InjectModel(PhysicalEvaluation)
    private physicalEvaluationModel: typeof PhysicalEvaluation,
    @InjectModel(BiochemicalEvaluation)
    private biochemicalEvaluationModel: typeof BiochemicalEvaluation,
    @InjectModel(AnthropometricEvaluation)
    private anthropometricEvaluationModel: typeof AnthropometricEvaluation,
    private foodConsumptionService: FoodConsumptionService,
    private authService: AuthService,
    private userService: UserService,
    private guidanceService: GuidanceService,
    private readonly clsService: ClsService<AppStore>,
    private sequelize: Sequelize,
    private bodyEvolutionService: BodyEvolutionService,
  ) {}

  async create({
    email,
    password,
    cpf,
    name,
    ...patientData
  }: CreatePatientDto) {
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

    return patient.clinicalEvaluations;
  }

  async createClinicalEvaluation(
    patientId: string,
    clinicalEvaluation: CreateClinicalEvaluationDto,
  ) {
    const patient = await this.getById(patientId);

    const newClinicalEvaluation = await this.clinicalEvaluationModel.create({
      ...clinicalEvaluation,
      patientId: patient.id,
    });

    return newClinicalEvaluation;
  }

  async getDailyFoodConsumptions(patientId: string, pagination: PaginationDto) {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.foodConsumptionService.getByPatient(patient.id, pagination);
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

  async getPhysicalEvaluations(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<PhysicalEvaluation[]>> {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    const { count, rows: data } =
      await this.physicalEvaluationModel.findAndCountAll({
        where: { patientId: patient.id },
        limit,
        offset,
      });

    return { totalCount: count, data };
  }

  async getPatientsWithoutBodyEvolutionLastThirtyDays() {
    const todayRange: [Date, Date] = [
      startOfDay(new Date()),
      endOfDay(new Date()),
    ];

    const patients = await this.patientModel.findAll({
      where: {
        [Op.or]: [
          {
            [Op.not]: {
              '$foodConsumptions.linkedDay$': {
                [Op.between]: todayRange,
              },
            },
          },
          {
            '$foodConsumptions.id$': null,
          },
        ],
      },
      include: {
        model: FoodConsumption,
        required: false,
      },
    });

    return patients;
  }

  async createBiochemicalEvaluation(
    patientId: string,
    data: CreateBiochemicalEvaluationDto,
  ) {
    const patient = await this.getById(patientId);

    const biochemicalEvaluation = await this.biochemicalEvaluationModel.create({
      ...data,
      patientId: patient.id,
    });

    return biochemicalEvaluation;
  }

  async getBiochemicalEvaluations(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<BiochemicalEvaluation[]>> {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    const { count, rows: data } =
      await this.biochemicalEvaluationModel.findAndCountAll({
        where: { patientId: patient.id },
        limit,
        offset,
      });

    return { totalCount: count, data };
  }

  async createAnthropometricEvaluation(
    patientId: string,
    data: CreateAnthropometricEvaluationDto,
  ) {
    const patient = await this.getById(patientId);

    const anthropometricEvaluation =
      await this.anthropometricEvaluationModel.create({
        ...data,
        patientId: patient.id,
      });

    return anthropometricEvaluation;
  }

  async getAnthropometricEvaluations(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<AnthropometricEvaluation[]>> {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    const { count, rows: data } =
      await this.anthropometricEvaluationModel.findAndCountAll({
        where: { patientId: patient.id },
        limit,
        offset,
      });

    return { totalCount: count, data };
  }

  async getGuidances(patientId: string, pagination: PaginationDto) {
    const { user } = this.clsService.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && !this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.guidanceService.getByPatientId(patient.id, pagination);
  }

  async registerHistoryWeightGain(
    patientId: string,
    { historyWeightGain }: RegisterHistoryWeightGainDto,
  ) {
    const patient = await this.getById(patientId);

    await patient.update({ historyWeightGain }).catch(() => {
      throw new BadRequestException(
        'Erro ao atualizar histórico de ganho de peso',
      );
    });

    return true;
  }

  async createBodyEvolution(patientId: string, file: Express.Multer.File) {
    const patient = await this.getById(patientId);

    if (!this.isSamePatientAsUser(patient)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return this.bodyEvolutionService.create(patientId, file);
  }
}
