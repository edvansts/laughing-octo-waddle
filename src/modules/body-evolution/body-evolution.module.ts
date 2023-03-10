import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BodyEvolution } from 'src/models/body-evolution.model';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BodyEvolutionService } from './body-evolution.service';

@Module({
  providers: [BodyEvolutionService],
  imports: [SequelizeModule.forFeature([BodyEvolution]), CloudinaryModule],
  exports: [BodyEvolutionService],
})
export class BodyEvolutionModule {}
