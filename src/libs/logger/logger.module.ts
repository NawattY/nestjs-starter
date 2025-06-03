import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { GraylogService } from './services/graylog.service';
import { CloudWatchLoggerService } from './services/cloudwatch.service';

@Global()
@Module({
  providers: [LoggerService, GraylogService, CloudWatchLoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
