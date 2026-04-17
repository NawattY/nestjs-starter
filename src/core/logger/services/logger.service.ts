import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { CoreConfigService } from '@app/core/config/config.service';

@Injectable()
export class LoggerService implements NestLoggerService {
  private level: string;
  private pretty: boolean;

  constructor(private readonly config: CoreConfigService) {
    const loggerConfig = this.config.get('logger') as {
      level: string;
      pretty: boolean;
    };

    this.level = loggerConfig.level;
    this.pretty = loggerConfig.pretty;
  }

  private format(level: string, message: any, context?: string, meta?: any) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...meta,
    };

    return this.pretty ? `[${level}] ${context ?? ''} ${message}` : JSON.stringify(log);
  }

  log(message: any, context?: string) {
    console.log(this.format('log', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.format('error', message, context, { trace }));
  }

  warn(message: any, context?: string) {
    console.warn(this.format('warn', message, context));
  }

  debug(message: any, context?: string) {
    if (this.level !== 'debug') return;
    console.debug(this.format('debug', message, context));
  }

  verbose(message: any, context?: string) {
    console.info(this.format('verbose', message, context));
  }
}
