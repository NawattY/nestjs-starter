import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: any, context?: string): any {
    console.log(`[LOG] ${context ?? ''}`, message);
  }

  error(message: any, trace?: string, context?: string): any {
    console.error(`[ERROR] ${context ?? ''}`, message, trace);
  }

  warn(message: any, context?: string): any {
    console.warn(`[WARN] ${context ?? ''}`, message);
  }

  debug?(message: any, context?: string): any {
    console.debug(`[DEBUG] ${context ?? ''}`, message);
  }

  verbose?(message: any, context?: string): any {
    console.info(`[VERBOSE] ${context ?? ''}`, message);
  }
}
