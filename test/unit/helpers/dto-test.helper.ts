import { validate, ValidationError } from 'class-validator';

/**
 * Validation error details interface
 */
export interface ValidationErrorDetail {
  property: string;
  constraints: string[];
  value: any;
}

/**
 * Helper class for DTO testing
 */
export class DtoTestHelper {
  /**
   * Validates a DTO instance and returns validation errors
   */
  static async validateDto(dto: any): Promise<ValidationErrorDetail[]> {
    const validationErrors = await validate(dto);
    
    return validationErrors.map((error: ValidationError) => ({
      property: error.property,
      constraints: Object.values(error.constraints || {}),
      value: error.value,
    }));
  }

  /**
   * Asserts that a DTO passes validation
   */
  static async expectValid(dto: any): Promise<void> {
    const errors = await this.validateDto(dto);
    if (errors.length > 0) {
      throw new Error(
        `DTO validation failed. Errors: ${JSON.stringify(errors, null, 2)}`
      );
    }
  }

  /**
   * Asserts that a DTO fails validation with specific errors
   */
  static async expectInvalid(
    dto: any,
    expectedErrors?: { property: string; constraints?: string[] }[]
  ): Promise<ValidationErrorDetail[]> {
    const errors = await this.validateDto(dto);
    
    if (errors.length === 0) {
      throw new Error('Expected DTO validation to fail, but it passed');
    }

    if (expectedErrors) {
      for (const expected of expectedErrors) {
        const error = errors.find(e => e.property === expected.property);
        if (!error) {
          throw new Error(
            `Expected validation error for property '${expected.property}' but found errors for: ${errors.map(e => e.property).join(', ')}`
          );
        }

        if (expected.constraints) {
          for (const constraint of expected.constraints) {
            if (!error.constraints.includes(constraint)) {
              throw new Error(
                `Expected constraint '${constraint}' for property '${expected.property}' but found: ${error.constraints.join(', ')}`
              );
            }
          }
        }
      }
    }

    return errors;
  }

  /**
   * Creates a test data factory function
   */
  static createFactory<T>(defaultData: T): (overrides?: Partial<T>) => T {
    return (overrides?: Partial<T>) => ({
      ...defaultData,
      ...overrides,
    });
  }
}
