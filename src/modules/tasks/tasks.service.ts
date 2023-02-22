import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpoPushMessage } from 'expo-server-sdk';
import { AppointmentsService } from '../appointments/appointments.service';
import { ExpoService } from '../expo/expo.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private appointmentsService: AppointmentsService,
    private expoService: ExpoService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkScheduledAppointments() {
    try {
      const appointmentsToNotice =
        await this.appointmentsService.getAppointmentsToNotice();

      await Promise.all(
        appointmentsToNotice?.map(
          async ({ id, pushNotificationTokens, message }) => {
            const messages = pushNotificationTokens.map<ExpoPushMessage>(
              (token) => ({
                to: token,
                title: 'Aviso de consulta',
                body: message,
                sound: 'default',
              }),
            );

            await this.expoService.sendPushMessages(...messages);
            await this.appointmentsService.markNotificationAsSended(id);
          },
        ),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
