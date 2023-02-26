import { Patient } from 'src/models/patient.model';

export class CreatePatientResponse {
  patient: Patient;
  token: string;
}
