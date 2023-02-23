import { ExpoPushMessage } from 'expo-server-sdk';
import { PRIORITY } from 'src/constants/enum';

export interface CreateNotificationParam extends Omit<ExpoPushMessage, 'to'> {
  scheduleDate: Date;
  pushTokens: string[];
  priority?: PRIORITY;
}
