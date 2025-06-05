import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadStrategy } from './strategies/file-upload.strategy';
import { LocalUploadStrategy } from './strategies/local.strategy';

@Module({
  providers: [
    FileUploadService,
    {
      provide: FileUploadStrategy,
      useClass: LocalUploadStrategy,
    },
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}
