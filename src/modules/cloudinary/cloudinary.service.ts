import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

interface CustomUploadApiResponse extends UploadApiResponse {
  eager?: {
    transformation: string;
    width: number;
    height: number;
    bytes: number;
    format: string;
    url: string;
    secure_url: string;
  }[];
}

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    uploadOptions: UploadApiOptions,
  ): Promise<CustomUploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result.eager);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    await v2.uploader.destroy(publicId);
  }
}
