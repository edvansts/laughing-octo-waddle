import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { PersonModule } from '../person/person.module';
import { UserService } from './user.service';
import { PushInfo } from 'src/models/push-info.model';

@Module({
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, PushInfo]), PersonModule],
  exports: [UserService],
})
export class UserModule {}
