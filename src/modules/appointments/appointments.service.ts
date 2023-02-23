import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { formatDistanceStrict, intervalToDuration, subMinutes } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Sequelize } from 'sequelize-typescript';
import { PRIORITY } from 'src/constants/enum';
import { Appointment } from 'src/models/appointment.model';
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
    userIds,
  }: {
    nutritionistId: string;
    patientId: string;
    minutesBeforeToNotice: number[];
    appointmentDate: Date;
    userIds: string[];
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
        userIds,
        scheduleDate,
        body: this.getAppointmentNotificationMessage({
          appointmentDate,
          scheduleDate,
        }),
        title: APPOINTMENT_NOTIFICATION_TITLE,
        priority: index === 0 ? PRIORITY.HIGH : undefined,
      }));

      await this.notificationService.create(notifications, { transaction });

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
    const { days, hours, minutes } = intervalToDuration({
      start: scheduleDate,
      end: appointmentDate,
    });

    const formattedDistance = formatDistanceStrict(
      scheduleDate,
      appointmentDate,
      {
        locale: ptBR,
      },
    );

    const daysDistance = hours > 22 ? days + 1 : days;

    if (daysDistance === 0 && hours === 0 && minutes < 1) {
      return `Passando para lembrar da sua consulta ${
        senderName ? `com ${senderName}` : ''
      } agora`;
    }

    return `Passando para lembrar da sua consulta ${
      senderName ? `com ${senderName}` : ''
    } em ${formattedDistance}`;
  }
}
