import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NutritionalData } from 'src/models/nutritional-data.model';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';
import { NutritionalDataService } from './nutritional-data.service';

@Module({
  providers: [NutritionalDataService],
  imports: [SequelizeModule.forFeature([NutritionalData]), CloudStorageModule],
  exports: [NutritionalDataService],
})
export class NutritionalDataModule {}
