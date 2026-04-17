import type { LoggerConfig } from '@app/config/logger.config';
import { CoreConfigService } from '@app/core/config/config.service';
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

type LogMeta = Record<string, unknown>;

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly level: string;
  private readonly pretty: boolean;

  constructor(private readonly config: CoreConfigService) {
    const loggerConfig = this.config.get<LoggerConfig>('logger');

    this.level = loggerConfig?.level ?? 'debug';
    this.pretty = loggerConfig?.isPretty ?? true;
  }

  private format(level: string, message: unknown, context?: string, meta?: LogMeta): string {
    const renderedMessage = typeof message === 'string' ? message : JSON.stringify(message);
    const log = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...meta,
    };

    return this.pretty ? `[${level}] ${context ?? ''} ${renderedMessage}` : JSON.stringify(log);
  }

  log(message: unknown, context?: string): void {
    console.log(this.format('log', message, context));
  }

  error(message: unknown, trace?: string, context?: string): void {
    console.error(this.format('error', message, context, { trace }));
  }

  warn(message: unknown, context?: string): void {
    console.warn(this.format('warn', message, context));
  }

  debug(message: unknown, context?: string): void {
    if (this.level !== 'debug') return;
    console.debug(this.format('debug', message, context));
  }

  verbose(message: unknown, context?: string): void {
    console.info(this.format('verbose', message, context));
  }
}
