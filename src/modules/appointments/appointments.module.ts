import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from 'src/models/appointment.model';
import { Notification } from 'src/models/notification.model';
import { AppointmentsService } from './appointments.service';

@Module({
  providers: [AppointmentsService],
  imports: [SequelizeModule.forFeature([Appointment, Notification])],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
