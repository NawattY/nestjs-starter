# Logger Module

Global Logger ที่สามารถเชื่อมต่อ CloudWatch, Graylog หรือ Logging platform อื่น ๆ ได้ภายหลัง
ใช้ `LoggerService` แทน `console.log()` หรือ `Logger` ปกติใน NestJS

## AI Notes

- ใช้ relative import ตามตำแหน่งไฟล์จริง เพราะ repo นี้ไม่ใช้ alias
- ถ้าต้องเพิ่ม transport ใหม่ ให้ต่อยอดจาก `src/core/logger/` แทนการกระจาย logging logic ไปตาม feature module
- ถ้าฟีเจอร์ต้องการ logging ให้ inject `LoggerService` ไม่ใช่เรียก `console.*` ตรง ๆ

```ts
import { LoggerService } from '../logger/services/logger.service';

constructor(private readonly logger: LoggerService) {}

this.logger.log('ข้อความทั่วไป');
this.logger.error('เกิดข้อผิดพลาด');
```
