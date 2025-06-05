import { Injectable } from '@nestjs/common';
import { FileUploadStrategy } from './file-upload.strategy';
import { Express } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LocalUploadStrategy implements FileUploadStrategy {
  private uploadDir = 'uploads';

  async upload(file: Express.Multer.File): Promise<string> {
    const dir = path.resolve(process.cwd(), this.uploadDir);
    if (!fs.existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const filePath = path.join(dir, file.originalname);
    await writeFile(filePath, file.buffer);
    return `/uploads/${file.originalname}`;
  }
}
