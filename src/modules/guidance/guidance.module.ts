import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guidance } from 'src/models/guidance.model';
import { NotificationModule } from '../notification/notification.module';
import { GuidanceService } from './guidance.service';

@Module({
  imports: [SequelizeModule.forFeature([Guidance]), NotificationModule],
  providers: [GuidanceService],
  exports: [GuidanceService],
})
export class GuidanceModule {}
