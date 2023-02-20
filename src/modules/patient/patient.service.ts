import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLE } from 'src/constants/user';
import { Patient } from 'src/models/patient.model';
import { UserService } from '../user/user.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientModel: typeof Patient,
    private userService: UserService,
  ) {}

  async create({
    ...data
  }: {
    email: string;
    password: string;
    name: string;
    cpf: string;
  }) {
    const user = await this.userService.create({
      ...data,
      role: ROLE.PATIENT,
    });

    const patient = await this.patientModel.create({
      personId: user.personId,
    });

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
