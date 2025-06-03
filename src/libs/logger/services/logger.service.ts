import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { GraylogService } from './graylog.service';
import { CloudWatchLoggerService } from './cloudwatch.service';

@Injectable()
export class LoggerService implements NestLogger {
  constructor(
    private readonly graylogService: GraylogService,
    private readonly cloudwatchService: CloudWatchLoggerService,
  ) {}

  log(message: any, context?: string) {
    console.log(message);
    this.graylogService.log(message, { context });
    this.cloudwatchService.log(`[LOG] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    console.error(message);
    this.graylogService.error(message, { trace, context });
    this.cloudwatchService.log(`[ERROR] ${message}`);
  }

  warn(message: any, context?: string) {
    console.warn(message);
    this.graylogService.warn(message, { context });
    this.cloudwatchService.log(`[WARN] ${message}`);
  }

  debug(message: any, context?: string) {
    this.cloudwatchService.log(`[DEBUG] ${message}`);
  }

  verbose(message: any, context?: string) {
    this.cloudwatchService.log(`[VERBOSE] ${message}`);
  }
}
