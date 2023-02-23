import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { addSeconds } from 'date-fns';
import { ExpoPushMessage } from 'expo-server-sdk';
import { Op } from 'sequelize';
import { BulkCreateOptions } from 'sequelize';
import { Notification } from 'src/models/notification.model';
import { ExpoService } from '../expo/expo.service';
import type { CreateNotificationParam } from './types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    private expoService: ExpoService,
  ) {}

  async create(
    notifications: CreateNotificationParam[],
    options: BulkCreateOptions<Notification>,
  ) {
    await this.notificationModel.bulkCreate(
      notifications.map(
        ({
          scheduleDate,
          pushTokens,
          data,
          title,
          body,
          subtitle,
          priority,
        }) => ({
          scheduleDate,
          message: body,
          pushTokens,
          data,
          title,
          subtitle,
          priority,
        }),
      ),
      options,
    );
  }

  async markAsSended(...notificationIds: string[]) {
    return await this.notificationModel.update(
      { isSended: true, sendedAt: new Date() },
      { where: { id: { [Op.in]: notificationIds } } },
    );
  }

  async getByInterval(interval: [Date, Date]) {
    const notifications = await this.notificationModel.findAll({
      where: {
        isSended: false,
        [Op.or]: [
          {
            scheduleDate: {
              [Op.between]: interval,
            },
          },
          {
            [Op.and]: {
              scheduleDate: {
                [Op.lt]: new Date(),
              },
            },
          },
        ],
      },
    });

    return notifications;
  }

  private async sendNotifications(
    messages: ExpoPushMessage[],
    pushTokens: string[],
  ) {
    await Promise.all([
      await this.expoService.sendPushMessages(...messages),
      await this.markAsSended(...pushTokens),
    ]);
  }

  async checkNotifications() {
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 60);

    const notificationsToSend = await this.getByInterval([startDate, endDate]);

    const messages: ExpoPushMessage[] = notificationsToSend?.map(
      ({ pushTokens, ...notification }) => ({
        ...notification,
        to: pushTokens,
      }),
    );

    const allPushTokens = notificationsToSend.reduce(
      (prevValue, { pushTokens }) => [...prevValue, ...pushTokens],
      [] as string[],
    );

    await this.sendNotifications(messages, allPushTokens);
  }
}
