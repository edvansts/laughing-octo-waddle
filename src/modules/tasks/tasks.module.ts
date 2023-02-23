import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  imports: [NotificationModule],
})
export class TasksModule {}
