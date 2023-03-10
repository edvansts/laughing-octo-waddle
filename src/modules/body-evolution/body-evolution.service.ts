import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, startOfDay, subHours } from 'date-fns';
import { Op } from 'sequelize';
import { BodyEvolution } from 'src/models/body-evolution.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UPLOAD_PRESETS } from '../cloudinary/constants';
import { PaginatedResponse } from '../common/response/paginated.response';
import { PaginationDto } from '../common/validators/pagination.dto';

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

  async getByPatientId(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<BodyEvolution[]>> {
    const { count, rows } = await this.bodyEvolutionModel.findAndCountAll({
      where: { patientId },
      limit,
      offset,
    });

    return {
      data: rows,
      totalCount: count,
    };
  }

  async delete(patientId: string, bodyEvolutionId: string) {
    const availabilityDateForDelete = subHours(new Date(), 1);

    const deletedCount = await this.bodyEvolutionModel.destroy({
      where: {
        patientId,
        id: bodyEvolutionId,
        uploadDate: { [Op.gte]: availabilityDateForDelete },
      },
    });

    if (!deletedCount) {
      throw new BadRequestException('Upload não encontrado');
    }

    return true;
  }
}
