import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkNotifications() {
    try {
      this.logger.log('Verificating notifications');

      await this.notificationService.checkNotifications();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
