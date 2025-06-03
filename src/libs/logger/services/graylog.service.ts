import * as gelf from 'gelf-pro';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GraylogService {
  constructor() {
    gelf.setConfig({
      fields: { facility: 'nestjs-app' }, // ค่าคงที่ที่แสดงว่า app นี้มาจากไหน
      adapterName: 'udp',
      adapterOptions: {
        host: process.env.GRAYLOG_HOST ?? '127.0.0.1',
        port: parseInt(process.env.GRAYLOG_PORT ?? '12201', 10),
      },
    });
  }

  log(message: string, additionalFields: Record<string, any> = {}) {
    gelf.info(message, additionalFields);
  }

  error(message: string, additionalFields: Record<string, any> = {}) {
    gelf.error(message, additionalFields);
  }

  warn(message: string, additionalFields: Record<string, any> = {}) {
    gelf.warning(message, additionalFields);
  }
}
