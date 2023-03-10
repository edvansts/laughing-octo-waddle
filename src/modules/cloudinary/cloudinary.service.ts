import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { UPLOAD_PRESETS } from './constants';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    { preset }: { preset: UPLOAD_PRESETS },
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { upload_preset: preset },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    await v2.uploader.destroy(publicId);
  }
}
