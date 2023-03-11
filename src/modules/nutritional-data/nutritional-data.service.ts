import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NutritionalData } from 'src/models/nutritional-data.model';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
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
}
