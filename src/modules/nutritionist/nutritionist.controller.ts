import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { RolesGuard } from 'src/config/guards/roles.guard';
import { NutritionistService } from './nutritionist.service';

@ApiTags('nutritionist')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('nutritionist')
export class NutritionistController {
  constructor(private nutritionistService: NutritionistService) {}

  @Get(':personId')
  async getNutritionistByPersonId(@Param('id') id: string) {
    return this.nutritionistService.getNutritionistByPersonId(id);
  }
}
