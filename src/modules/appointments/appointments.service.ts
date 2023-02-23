import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { intervalToDuration, subMinutes } from 'date-fns';
import { Sequelize } from 'sequelize-typescript';
import { PRIORITY } from 'src/constants/enum';
import { Appointment } from 'src/models/appointment.model';
import { getPlural } from 'src/utils/text';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationParam } from '../notification/types';

const APPOINTMENT_NOTIFICATION_TITLE = 'Lembrete';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment) private appointmentModel: typeof Appointment,
    private notificationService: NotificationService,
    private sequelize: Sequelize,
  ) {}

  async create({
    appointmentDate,
    minutesBeforeToNotice,
    nutritionistId,
    patientId,
    pushTokens,
  }: {
    nutritionistId: string;
    patientId: string;
    minutesBeforeToNotice: number[];
    appointmentDate: Date;
    pushTokens: string[];
  }) {
    const transaction = await this.sequelize.transaction();

    try {
      const newAppointment = await this.appointmentModel.create(
        {
          appointmentDate,
          nutritionistId,
          patientId,
        },
        { transaction },
      );

      const notifications: CreateNotificationParam[] = [
        appointmentDate,
        ...minutesBeforeToNotice.map((minutes) =>
          subMinutes(appointmentDate, minutes),
        ),
      ].map((scheduleDate, index) => ({
        pushTokens,
        scheduleDate,
        body: this.getAppointmentNotificationMessage({
          appointmentDate,
          scheduleDate,
        }),
        title: APPOINTMENT_NOTIFICATION_TITLE,
        priority: index === 0 ? PRIORITY.HIGH : undefined,
      }));

      this.notificationService.create(notifications, { transaction });

      await transaction.commit();

      return newAppointment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  private getAppointmentNotificationMessage({
    appointmentDate,
    scheduleDate,
    senderName,
  }: {
    senderName?: string;
    appointmentDate: Date;
    scheduleDate: Date;
  }) {
    const { days, hours } = intervalToDuration({
      start: scheduleDate,
      end: appointmentDate,
    });

    const daysDistance = hours > 22 ? days + 1 : days;

    const message = `Passando para lembrar da sua consulta ${
      senderName ? `com ${senderName}` : ''
    } daqui a ${daysDistance} dia${getPlural(daysDistance)}`;

    return message;
  }
}
