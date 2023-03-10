import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isEmpty } from 'class-validator';
import { NotificationService } from '../notification/notification.service';
import { PatientService } from '../patient/patient.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly patientService: PatientService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledNotifications() {
    try {
      this.logger.log('Verificating scheduled notifications');

      await this.notificationService.checkNotifications();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async rememberSendBodyEvolution() {
    try {
      this.logger.log(
        'Verificating patients without send body evolution in last 30 days',
      );

      const patients =
        await this.patientService.getPatientsWithoutBodyEvolutionLastThirtyDays();

      if (isEmpty(patients)) {
        return;
      }

      const personIds = patients.map(({ personId }) => personId);

      await this.notificationService.notifyUsersAboutFoodConsumptionRegister(
        personIds,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
