import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { PersonModule } from '../person/person.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User]), PersonModule],
  exports: [UserService],
})
export class UserModule {}
