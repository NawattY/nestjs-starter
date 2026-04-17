import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { ERROR_MESSAGE } from '@app/constants/error-message.constant';

export function createValidationPipe(options?: ValidationPipeOptions) {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    ...options,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errors = validationErrors.reduce(
        (acc, curr) => {
          if (curr.constraints) {
            acc[curr.property] = Object.values(curr.constraints);
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return new BadRequestException({
        errorCode: ERROR_CODE.VALIDATE_ERROR,
        errorMessage:
          ERROR_MESSAGE[ERROR_CODE.VALIDATE_ERROR] ?? 'VALIDATE ERROR',
        errors,
      });
    },
  });
}
