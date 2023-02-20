import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLE } from 'src/constants/user';
import { Nutritionist } from 'src/models/nutritionist.model';
import { UserService } from '../user/user.service';

@Injectable()
export class NutritionistService {
  constructor(
    @InjectModel(Nutritionist) private nutritionistModel: typeof Nutritionist,
    private userService: UserService,
  ) {}

  async create({
    isAdmin = false,
    crn,
    ...data
  }: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    isAdmin?: boolean;
    crn: string;
  }) {
    const nutritionistRole = isAdmin ? ROLE.ADMIN : ROLE.NUTRITIONIST;

    const user = await this.userService.create({
      ...data,
      role: nutritionistRole,
    });

    const nutritionist = await this.nutritionistModel.create({
      personId: user.personId,
      crn,
    });

    return nutritionist.toJSON();
  }

  async getNutritionistByPersonId(personId: string) {
    const nutritionist = await this.nutritionistModel.findOne({
      where: { personId },
    });

    if (!nutritionist) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return nutritionist.toJSON();
  }
}
