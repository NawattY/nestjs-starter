# Logger Module

Global Logger ที่สามารถเชื่อมต่อ CloudWatch, Graylog หรือ Logging platform อื่น ๆ ได้ภายหลัง
ใช้ `LoggerService` แทน `console.log()` หรือ `Logger` ปกติใน NestJS

npm install gelf-pro
npm install @aws-sdk/client-cloudwatch-logs

```ts
import { LoggerService } from 'src/libs/logger/services/logger.service';

constructor(private readonly logger: LoggerService) {}

this.logger.log('ข้อความทั่วไป');
this.logger.error('เกิดข้อผิดพลาด');
```
