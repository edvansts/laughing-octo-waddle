import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import { BodyEvolution } from 'src/models/body-evolution.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UPLOAD_PRESETS } from '../cloudinary/constants';

@Injectable()
export class BodyEvolutionService {
  constructor(
    @InjectModel(BodyEvolution)
    private bodyEvolutionModel: typeof BodyEvolution,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(patientId: string, file: Express.Multer.File) {
    const image = await this.cloudinaryService
      .uploadImage(file, {
        preset: UPLOAD_PRESETS.BODY_EVOLUTION,
      })
      .catch(() => {
        throw new BadRequestException(
          'Não foi possível fazer o upload da imagem, tente novamente mais tarde',
        );
      });

    try {
      const range: [Date, Date] = [
        startOfDay(new Date()),
        endOfDay(new Date()),
      ];

      const bodyEvolutionsUploadedLast24Hours =
        await this.bodyEvolutionModel.findAll({
          where: { uploadDate: { [Op.between]: range } },
        });

      if (bodyEvolutionsUploadedLast24Hours.length > 3) {
        throw new BadRequestException('Limite de uploads atingido hoje');
      }

      const bodyEvolution = await this.bodyEvolutionModel.create({
        publicId: image.public_id,
        imageUrl: image.url,
        uploadDate: new Date(),
        patientId,
      });

      return bodyEvolution;
    } catch (err) {
      this.cloudinaryService.deleteImage(image.public_id);

      throw err;
    }
  }
}
