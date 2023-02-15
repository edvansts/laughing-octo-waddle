import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Person } from 'src/models/person.model';

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private personModel: typeof Person) {}

  async create(data: { name: string; cpf: string }) {
    const { cpf, name } = data;

    const newPerson = await this.personModel.create({ name, cpf });

    return newPerson.toJSON();
  }
}
