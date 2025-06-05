import { Injectable } from '@nestjs/common';
import { FileUploadStrategy } from './strategies/file-upload.strategy';

@Injectable()
export class FileUploadService {
  constructor(private readonly strategy: FileUploadStrategy) {}

  async upload(file: Express.Multer.File): Promise<string> {
    return this.strategy.upload(file);
  }
}
