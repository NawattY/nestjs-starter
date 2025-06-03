import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logRequest(message: string) {
    this.log(`[Request] ${message}`);
  }

  logError(message: string) {
    this.error(`[Error] ${message}`);
  }
}
