import { Injectable } from '@nestjs/common';
import { FileUploadStrategy } from './file-upload.strategy';
import { Express } from 'express';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3UploadStrategy implements FileUploadStrategy {
  private s3 = new S3();
  private bucket = process.env.AWS_S3_BUCKET || 'your-bucket-name';

  async upload(file: Express.Multer.File): Promise<string> {
    const key = `${uuidv4()}-${file.originalname}`;

    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}
