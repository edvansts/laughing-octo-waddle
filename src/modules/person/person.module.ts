import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person } from 'src/models/person.model';
import { PersonService } from './person.service';

@Module({
  providers: [PersonService],
  imports: [SequelizeModule.forFeature([Person])],
  exports: [PersonService],
})
export class PersonModule {}
