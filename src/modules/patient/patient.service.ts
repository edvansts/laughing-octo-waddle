import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClsService } from 'nestjs-cls';
import { FindOptions } from 'sequelize';
import { ROLE } from 'src/constants/user';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { Patient } from 'src/models/patient.model';
import { Person } from 'src/models/person.model';
import { AppStore } from 'src/types/services';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { RegisterClinicalEvaluationDto } from './validators/register-clinical-evaluation.dto';
import { RegisterPatientDto } from './validators/register-patient.dto';
import { UpdatePatientDto } from './validators/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    @InjectModel(ClinicalEvaluation)
    private clinicalEvaluationModel: typeof ClinicalEvaluation,
    private authService: AuthService,
    private userService: UserService,
    private readonly cls: ClsService<AppStore>,
  ) {}

  async create(data: RegisterPatientDto) {
    const user = await this.userService.create({
      ...data,
      role: ROLE.PATIENT,
    });

    const patient = await this.patientModel.create(
      {
        personId: user.personId,
      },
      { include: Person },
    );

    const token = await this.authService.signPayload({
      email: data.email,
      password: data.password,
    });

    const payload = {
      patient: patient.toJSON(),
      token,
    };

    return payload;
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
    const { user } = this.cls.get();

    const patient = await this.getById(patientId);

    if (user.role === ROLE.PATIENT && patient.personId !== user.personId) {
      throw new UnauthorizedException();
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
}
