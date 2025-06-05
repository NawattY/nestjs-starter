import { Express } from 'express';

export abstract class FileUploadStrategy {
  abstract upload(file: Express.Multer.File): Promise<string>;
}
