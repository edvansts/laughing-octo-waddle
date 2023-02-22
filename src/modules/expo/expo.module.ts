import { Module } from '@nestjs/common';
import { ExpoService } from './expo.service';

@Module({
  providers: [ExpoService],
  exports: [ExpoService],
})
export class ExpoModule {}
