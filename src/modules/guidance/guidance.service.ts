import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Guidance } from 'src/models/guidance.model';
import { PaginatedResponse } from '../common/response/paginated.response';
import { PaginationDto } from '../common/validators/pagination.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GuidanceService {
  constructor(
    @InjectModel(Guidance) private readonly guidanceModel: typeof Guidance,
    private notificationService: NotificationService,
  ) {}

  async create({
    patientUserId,
    ...data
  }: {
    nutritionistId: string;
    patientId: string;
    nutritionalGuidance: string;
    patientUserId: string;
  }) {
    const guidance = await this.guidanceModel.create(data);

    this.notificationService.create([
      {
        scheduleDate: new Date(),
        userIds: [patientUserId],
        title: 'Você tem uma nova orientação cadastrada',
        subtitle: 'Clica aqui pra ver',
        data: { guidance },
      },
    ]);

    return guidance;
  }

  async getByPatientId(
    patientId: string,
    { limit, offset }: PaginationDto,
  ): Promise<PaginatedResponse<Guidance[]>> {
    const { count, rows } = await this.guidanceModel.findAndCountAll({
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
