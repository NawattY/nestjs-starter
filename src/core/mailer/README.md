# Logger Module

Global Logger ที่สามารถเชื่อมต่อ CloudWatch, Graylog หรือ Logging platform อื่น ๆ ได้ภายหลัง
ใช้ `LoggerService` แทน `console.log()` หรือ `Logger` ปกติใน NestJS

```ts
import { LoggerService } from '@app/core/logger/services/logger.service';

constructor(private readonly logger: LoggerService) {}

this.logger.log('ข้อความทั่วไป');
this.logger.error('เกิดข้อผิดพลาด');
```
