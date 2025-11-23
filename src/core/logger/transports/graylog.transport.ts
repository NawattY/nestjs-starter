// import axios from 'axios';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class GraylogTransport {
//   private url = process.env.GRAYLOG_ENDPOINT!; // http://graylog:12201/gelf

//   async send(message: any) {
//     await axios.post(this.url, {
//       version: '1.1',
//       host: 'nestjs-app',
//       short_message: message.message,
//       full_message: JSON.stringify(message),
//       timestamp: Date.now() / 1000,
//       level: this.mapLevel(message.level),
//     });
//   }

//   private mapLevel(level: string): number {
//     switch (level) {
//       case 'error': return 3;
//       case 'warn': return 4;
//       case 'info': return 6;
//       default: return 7;
//     }
//   }
// }
