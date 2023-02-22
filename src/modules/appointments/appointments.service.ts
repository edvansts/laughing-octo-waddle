import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { addSeconds, subMinutes } from 'date-fns';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Appointment } from 'src/models/appointment.model';
import { Notification } from 'src/models/notification.model';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment) private appointmentModel: typeof Appointment,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    private sequelize: Sequelize,
  ) {}

  async create({
    appointmentDate,
    minutesBeforeToNotice,
    nutritionistId,
    patientId,
    pushNotificationTokens,
  }: {
    nutritionistId: string;
    patientId: string;
    minutesBeforeToNotice: number[];
    appointmentDate: Date;
    pushNotificationTokens: string[];
  }) {
    console.log(pushNotificationTokens);
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

      const notificationsArray = [
        appointmentDate,
        ...minutesBeforeToNotice.map((minutes) =>
          subMinutes(appointmentDate, minutes),
        ),
      ];

      await this.notificationModel.bulkCreate(
        notificationsArray.map((notification) => ({
          scheduleTime: notification,
          appointmentId: newAppointment.id,
          message: 'Você tem uma consulta marcada daqui a X minutos',
          pushNotificationTokens,
        })),
        { transaction },
      );

      await transaction.commit();

      return newAppointment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getAppointmentsToNotice() {
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 60);

    const notifications = await this.notificationModel.findAll({
      where: {
        isSended: false,
        [Op.or]: [
          {
            scheduleTime: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: {
              scheduleTime: {
                [Op.lt]: startDate,
              },
            },
          },
        ],
      },
    });

    return notifications;
  }

  async markNotificationAsSended(notificationId: string) {
    return await this.notificationModel.update(
      { isSended: true, sendedAt: new Date() },
      { where: { id: notificationId } },
    );
  }
}
