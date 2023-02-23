import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { ROLE } from 'src/constants/user';
import { Patient } from 'src/models/patient.model';
import { AuthService } from '../auth/auth.service';
import { RegisterPatientDto } from './validators/register-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    private authService: AuthService,
  ) {}

  async create(data: RegisterPatientDto) {
    const user = await this.authService.createUser({
      ...data,
      role: ROLE.PATIENT,
    });

    const patient = await this.patientModel.create({
      personId: user.personId,
    });

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
}