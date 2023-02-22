import { IsString } from 'class-validator';

export class CheckInDto {
  @IsString()
  pushNotificationToken: string;
}
