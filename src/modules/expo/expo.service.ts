import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class ExpoService {
  private expoClient: Expo;
  private readonly logger = new Logger(ExpoService.name);

  constructor() {
    this.expoClient = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  }

  validatePushToken(pushToken: string) {
    const isValid = Expo.isExpoPushToken(pushToken);

    return isValid;
  }

  async sendPushMessages(...messages: ExpoPushMessage[]) {
    const chuncks = this.expoClient.chunkPushNotifications(messages);

    const tickets = await Promise.all(
      chuncks.map(async (chunck) => {
        try {
          const tickets = await this.expoClient.sendPushNotificationsAsync(
            chunck,
          );

          return tickets;
        } catch (err) {
          this.logger.error(err);
        }
      }),
    );

    return ([] as ExpoPushTicket[]).concat(...tickets);
  }
}
