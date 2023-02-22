import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ExpoModule } from '../expo/expo.module';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
  imports: [AppointmentsModule, ExpoModule],
})
export class TasksModule {}
