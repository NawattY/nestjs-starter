import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import * as ms from 'ms';

export function IsMsDuration(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMsDuration',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false; // ต้องเป็น string ก่อน
          }

          try {
            const milliseconds = ms(value as ms.StringValue);

            return typeof milliseconds === 'number' && !Number.isNaN(milliseconds);
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ms duration string (e.g., '1h', '30d').`;
        },
      },
    });
  };
}
