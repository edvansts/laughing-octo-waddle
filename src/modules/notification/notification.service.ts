import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isEmpty } from 'class-validator';
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
    notificationIds: string[] = [],
  ) {
    const promises: Promise<any>[] = [];

    promises.push(this.expoService.sendPushMessages(...messages));

    if (!isEmpty(notificationIds)) {
      promises.push(this.markAsSended(...notificationIds));
    }

    await Promise.all(promises);
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
        const pushTokens = await this.userService.getPushTokensById(...userIds);

        return {
          ...notification,
          to: pushTokens,
        };
      }),
    );

    const notificationIds = notificationsToSend.map(({ id }) => id);

    await this.sendNotifications(messages, notificationIds);
  }

  async notifyUsersAboutFoodConsumptionRegister(personIds: string[]) {
    const pushTokens = await this.userService.getPushTokensByPersonId(
      ...personIds,
    );

    const message: ExpoPushMessage = {
      to: pushTokens,
      title: 'Ainda dá tempo!',
      body: 'Entra e cadastra rapidinho seu consumo alimentar de hoje aqui no meu app 😟',
    };

    await this.sendNotifications([message]);
  }
}
