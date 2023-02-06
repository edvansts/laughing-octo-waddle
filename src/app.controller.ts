import { BadRequestException, Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { Nutritionist } from './schemas/nutritionist.schema';
import { Person } from './schemas/person.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(Nutritionist)
    private nutritionistModel: typeof Nutritionist,
    @InjectModel(Person)
    private personModel: typeof Person,
  ) {}

  @Get()
  async getHello(): Promise<Nutritionist[]> {
    const newName = 'Edvan';

    try {
      const person = this.personModel.build({ name: newName });

      await person.save();

      await this.nutritionistModel.create({
        person,
        personId: person.id,
      });

      return (await this.nutritionistModel.findAll()).map((nutritionist) =>
        nutritionist.toJSON(),
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
