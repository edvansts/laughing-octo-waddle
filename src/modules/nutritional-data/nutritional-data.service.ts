import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NutritionalData } from 'src/models/nutritional-data.model';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { PaginatedResponse } from '../common/response/paginated.response';
import { PaginationDto } from '../common/validators/pagination.dto';
import { NUTRITIONAL_DATA_PATH } from './constants';
import { CreateNutritionalDataParams } from './types';

@Injectable()
export class NutritionalDataService {
  private folderId: string;
  private folderName: string;

  constructor(
    @InjectModel(NutritionalData)
    private nutritionalDataModel: typeof NutritionalData,
    private readonly cloudStorageService: CloudStorageService,
  ) {
    cloudStorageService
      .findOrCreateFolder(NUTRITIONAL_DATA_PATH)
      .then(({ id, name }) => {
        this.folderId = id;
        this.folderName = name;
      });
  }

  async create({
    description,
    file,
    nutritionistId,
    patientId,
  }: CreateNutritionalDataParams) {
    const {
      data: { webViewLink },
    } = await this.cloudStorageService.savePdf(
      file.filename,
      file.buffer,
      this.folderId,
    );

    const nutritionalData = await this.nutritionalDataModel.create({
      fileUrl: webViewLink,
      nutritionistId,
      patientId,
      description,
    });

    return nutritionalData;
  }

  async getByPatient(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<NutritionalData[]>> {
    const { count, rows } = await this.nutritionalDataModel.findAndCountAll({
      where: { patientId },
      limit,
      offset,
    });

    return {
      data: rows,
      totalCount: count,
    };
  }
}
