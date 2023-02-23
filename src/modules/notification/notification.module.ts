import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from 'src/models/notification.model';
import { ExpoModule } from '../expo/expo.module';
import { UserModule } from '../user/user.module';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService],
  imports: [SequelizeModule.forFeature([Notification]), ExpoModule, UserModule],
  exports: [NotificationService],
})
export class NotificationModule {}
