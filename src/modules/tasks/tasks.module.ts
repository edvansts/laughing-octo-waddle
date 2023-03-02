import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { PatientModule } from '../patient/patient.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  imports: [NotificationModule, PatientModule],
})
export class TasksModule {}
