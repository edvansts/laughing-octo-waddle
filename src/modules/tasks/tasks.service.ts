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
  async checkNotifications() {
    try {
      this.logger.log('Verificating notifications');

      await this.notificationService.checkNotifications();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async rememberDailyFoodConsumption() {
    try {
      this.logger.log('Verificating daily food consumptions');

      const patients =
        await this.patientService.checkSendDailyFoodConsumptions();

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
