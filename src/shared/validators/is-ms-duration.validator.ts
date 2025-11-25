import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments 
} from 'class-validator';
import * as ms from 'ms';

export function IsMsDuration(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMsDuration',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false; // ต้องเป็น string ก่อน
          }
          
          try {
            // ใช้ไลบรารี ms ในการลองแปลงค่า
            const milliseconds = ms(value as ms.StringValue);
            
            // ถ้าแปลงแล้วได้ผลลัพธ์เป็นตัวเลขที่ถูกต้อง (ไม่ใช่ undefined หรือ NaN) 
            // แสดงว่าเป็นรูปแบบที่ ms ยอมรับ
            return typeof milliseconds === 'number' && !isNaN(milliseconds);
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ms duration string (e.g., '1h', '30d').`;
        }
      },
    });
  };
}