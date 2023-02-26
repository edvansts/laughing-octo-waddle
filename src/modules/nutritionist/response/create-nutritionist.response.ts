import { Nutritionist } from 'src/models/nutritionist.model';

export class CreateNutritionistResponse {
  nutritionist: Nutritionist;
  token: string;
}
