import { auth, drive, drive_v3 } from '@googleapis/drive';
import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PartialDriveFile, SearchResultResponse } from './types';

@Injectable()
export class CloudStorageService {
  private drive: drive_v3.Drive;

  constructor() {
    this.drive = this.createDriveClient(
      process.env.GOOGLE_API_CLIENT_ID,
      process.env.GOOGLE_API_CLIENT_SECRET,
      process.env.GOOGLE_API_REDIRECT_URI,
      process.env.GOOGLE_API_REDIRECT_URI,
    );
  }

  private createDriveClient(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
  ) {
    const client = new auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return drive({
      version: 'v3',
      auth: client,
    });
  }

  async createFolder(folderName: string) {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const newFolder = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    return newFolder;
  }

  searchFolder(folderName: string): Promise<PartialDriveFile | null> {
    return new Promise((resolve, reject) => {
      this.drive.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          const data = res.data as SearchResultResponse;

          if (!data.files) {
            return resolve(null);
          }

          return resolve(data.files[0]);
        },
      );
    });
  }

  private saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId?: string,
  ) {
    return this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: createReadStream(filePath),
      },
    });
  }

  async savePdf(fileName: string, filePath: string, folderId: string) {
    const pdfMimeType = 'application/pdf';

    return this.saveFile(fileName, filePath, pdfMimeType, folderId);
  }

  async getFiles() {
    try {
      const response = await this.drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      });
      const files = response.data.files;

      return files;
    } catch (err) {
      throw new Error('Erro ao ler arquivos');
    }
  }
}
