import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { addSeconds } from 'date-fns';
import { ExpoPushMessage } from 'expo-server-sdk';
import { Op } from 'sequelize';
import { BulkCreateOptions } from 'sequelize';
import { Notification } from 'src/models/notification.model';
import { ExpoService } from '../expo/expo.service';
import { UserService } from '../user/user.service';
import type { CreateNotificationParam } from './types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    private expoService: ExpoService,
    private userService: UserService,
  ) {}

  async create(
    notifications: CreateNotificationParam[],
    options: BulkCreateOptions<Notification>,
  ) {
    await this.notificationModel.bulkCreate(
      notifications.map(
        ({ scheduleDate, userIds, data, title, body, subtitle, priority }) => ({
          scheduleDate,
          message: body,
          userIds,
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
        scheduleDate: {
          [Op.or]: {
            [Op.between]: interval,
            [Op.lt]: new Date(),
          },
        },
      },
    });

    return notifications;
  }

  private async sendNotifications(
    messages: ExpoPushMessage[],
    notificationIds: string[],
  ) {
    await Promise.all([
      await this.expoService.sendPushMessages(...messages),
      await this.markAsSended(...notificationIds),
    ]);
  }

  async checkNotifications() {
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 60);

    const notificationsToSend = await this.getByInterval([startDate, endDate]);

    if (notificationsToSend.length === 0) {
      return;
    }

    const messages: ExpoPushMessage[] = await Promise.all(
      notificationsToSend?.map(async ({ userIds, ...notification }) => {
        const pushTokens = await this.userService.getPushTokensByUserId(
          ...userIds,
        );

        return {
          ...notification,
          to: pushTokens,
        };
      }),
    );

    const notificationIds = notificationsToSend.map(({ id }) => id);

    await this.sendNotifications(messages, notificationIds);
  }
}
