import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsDateString()
  appointmentDate: string;

  @IsNumber({}, { each: true })
  notificationTimes: number[];
}
