# Mailer Module

`MailerModule` เป็น global module ที่ export `MailerService`

## Current State

- implementation ปัจจุบันใน `src/core/mailer/services/mailer.service.ts` ยังเป็น placeholder
- service นี้ยังไม่ได้เชื่อม SMTP, SES, SendGrid, หรือ provider จริง
- method ปัจจุบันแค่เขียนข้อความออก console ในรูปแบบคล้าย logger

## AI Notes

- อย่าสมมติว่า repo นี้มีระบบส่งอีเมลพร้อมใช้แล้ว
- ถ้างานใหม่ต้องส่งอีเมลจริง ให้ถือว่าเป็น feature ใหม่ที่ต้องออกแบบ provider, config, error handling, และ integration ให้ครบ
- ถ้าต้องใช้งานชั่วคราวในระดับ scaffold/testing ให้ inject `MailerService` ได้ แต่ต้องเข้าใจว่า current behavior ยังไม่ใช่ real mail delivery
- ใช้ relative import ตามตำแหน่งไฟล์จริง เพราะ repo นี้ไม่ใช้ alias

## Example

```ts
import { MailerService } from '../mailer/services/mailer.service';

constructor(private readonly mailerService: MailerService) {}

this.mailerService.log('mail job placeholder', 'UserSignupService');
```
