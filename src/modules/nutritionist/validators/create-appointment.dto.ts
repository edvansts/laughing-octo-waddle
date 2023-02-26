import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @Type(() => Date)
  @IsDate()
  appointmentDate: Date;

  @IsNumber({}, { each: true })
  notificationTimes: number[];
}
