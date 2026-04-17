import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class MailerService implements NestLoggerService {
  log(message: unknown, context?: string): void {
    console.log(`[LOG] ${context ?? ''}`, message);
  }

  error(message: unknown, trace?: string, context?: string): void {
    console.error(`[ERROR] ${context ?? ''}`, message, trace);
  }

  warn(message: unknown, context?: string): void {
    console.warn(`[WARN] ${context ?? ''}`, message);
  }

  debug?(message: unknown, context?: string): void {
    console.debug(`[DEBUG] ${context ?? ''}`, message);
  }

  verbose?(message: unknown, context?: string): void {
    console.info(`[VERBOSE] ${context ?? ''}`, message);
  }
}
