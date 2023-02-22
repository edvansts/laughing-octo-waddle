import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { PersonModule } from '../person/person.module';
import { UserService } from './user.service';
import { PushNotificationToken } from 'src/models/push-notification-token.moduel';

@Module({
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, PushNotificationToken]),
    PersonModule,
  ],
  exports: [UserService],
})
export class UserModule {}
