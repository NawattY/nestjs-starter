import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validateSync, ValidatorOptions } from 'class-validator';

/**
 * Validates a raw configuration object against a validation class.
 * @param ConfigValidationClass The class with class-validator decorators.
 * @param rawConfigValues The raw configuration values (e.g., from process.env).
 * @param configNamespace A namespace string for more descriptive error messages.
 * @param classTransformerOptions Options for plainToInstance.
 * @param validatorOptions Options for validateSync.
 * @returns The validated and potentially transformed configuration object.
 * @throws Error if validation fails.
 */
export function validateAndTransformConfig<T extends object>(
  ConfigValidationClass: ClassConstructor<T>, // Class ที่มี Decorators สำหรับ Validate
  rawConfigValues: Record<string, any>, // Object ของค่า Config ดิบๆ
  configNamespace: string = 'Configuration', // ชื่อ Namespace สำหรับ Error Message
  classTransformerOptions?: Parameters<typeof plainToInstance>[2], // Options สำหรับ plainToInstance
  validatorOptions?: ValidatorOptions, // Options สำหรับ validateSync
): T {
  const instanceToValidate = plainToInstance(
    ConfigValidationClass,
    rawConfigValues,
    {
      enableImplicitConversion: true, // เปิดใช้งานการแปลง Type อัตโนมัติโดยปริยาย
      ...classTransformerOptions, // สามารถ Override หรือเพิ่ม Options ได้
    },
  );

  const errors = validateSync(instanceToValidate, {
    skipMissingProperties: false, // ไม่ข้าม Property ที่หายไป (ถ้าต้องการให้ Strict)
    ...validatorOptions, // สามารถ Override หรือเพิ่ม Options ได้
  });

  if (errors.length > 0) {
    const messages = errors
      .map((err) => {
        // ตรวจสอบว่า err.constraints ไม่ใช่ undefined ก่อนเรียก Object.values
        const constraintMessages = err.constraints
          ? Object.values(err.constraints).join(', ')
          : 'No constraints message';
        return `${err.property}: ${constraintMessages}`;
      })
      .join('; ');
    throw new Error(`[${configNamespace}] Validation failed: ${messages}`);
  }

  return instanceToValidate; // คืนค่า Object ที่ผ่านการ Validate และ Transform แล้ว
}
