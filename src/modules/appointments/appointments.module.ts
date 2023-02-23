import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from 'src/models/appointment.model';
import { NotificationModule } from '../notification/notification.module';
import { AppointmentsService } from './appointments.service';

@Module({
  providers: [AppointmentsService],
  imports: [SequelizeModule.forFeature([Appointment]), NotificationModule],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
