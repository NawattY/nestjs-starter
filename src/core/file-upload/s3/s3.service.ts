import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  uploadFile(file: Buffer, filename: string): string {
    // mock implementation
    return `https://s3.amazonaws.com/mybucket/${filename}`;
  }
}
