import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { ROLE } from 'src/constants/user';
import { ClinicalEvaluation } from 'src/models/clinical-evaluation.model';
import { Patient } from 'src/models/patient.model';
import { Person } from 'src/models/person.model';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { RegisterClinicalEvaluationDto } from './validators/register-clinical-evaluation.dto';
import { RegisterPatientDto } from './validators/register-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    @InjectModel(ClinicalEvaluation)
    private clinicalEvaluationModel: typeof ClinicalEvaluation,
    private authService: AuthService,
    private userService: UserService,
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
