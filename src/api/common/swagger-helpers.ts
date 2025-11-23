import { ERROR_CODE } from '#constants/error-code.constant';
import { ERROR_MESSAGE } from '#constants/error-message.constant';

/**
 * Swagger response helpers for consistent API documentation
 * Usage: Import and use in swagger response files
 * 
 * Example:
 * ```ts
 * export const getMerchantResponse = [
 *   SwaggerHelpers.success(200, merchantExample),
 *   SwaggerHelpers.unauthorized(),
 *   SwaggerHelpers.notFound('Merchant'),
 * ];
 * ```
 */
export class SwaggerHelpers {
  /**
   * Success response helper
   * @param status HTTP status code (usually 200, 201)
   * @param example Response body example
   * @param description Optional description (default: 'Success')
   */
  static success(status: number, example: any, description: string = 'Success') {
    return {
      status,
      description,
      examples: {
        Success: {
          value: example,
        },
      },
    };
  }

  /**
   * 400 Bad Request - Validation Error
   * @param customErrors Optional custom validation errors
   */
  static validationError(customErrors?: string[] | Record<string, string[]>) {
    return {
      status: 400,
      description: 'Bad Request',
      examples: {
        'Error: Validation Error': {
          value: {
            status: {
              code: 400,
              message: 'Bad Request',
            },
            error: {
              code: ERROR_CODE.VALIDATE_ERROR,
              message: ERROR_MESSAGE[ERROR_CODE.VALIDATE_ERROR],
              errors: customErrors || {
                field1: ['field1 is required'],
                field2: ['field2 must be a string'],
              },
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized() {
    return {
      status: 401,
      description: 'Unauthorized',
      examples: {
        'Error: Unauthorized': {
          value: {
            status: {
              code: 401,
              message: 'Unauthorized',
            },
            error: {
              code: ERROR_CODE.UNAUTHORIZED,
              message: ERROR_MESSAGE[ERROR_CODE.UNAUTHORIZED],
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * 403 Forbidden
   */
  static forbidden() {
    return {
      status: 403,
      description: 'Forbidden',
      examples: {
        'Error: Forbidden': {
          value: {
            status: {
              code: 403,
              message: 'Forbidden',
            },
            error: {
              code: ERROR_CODE.UNAUTHORIZED,
              message: 'Forbidden',
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * 404 Not Found
   * @param resourceName Name of resource (e.g., 'Merchant', 'User')
   * @param customMessage Optional custom message
   */
  static notFound(resourceName: string, customMessage?: string) {
    const message = customMessage || `${resourceName} not found`;
    return {
      status: 404,
      description: 'Not Found',
      examples: {
        'Error: Not Found': {
          value: {
            status: {
              code: 404,
              message: 'Not Found',
            },
            error: {
              code: ERROR_CODE.NOT_FOUND,
              message,
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * 409 Conflict
   * @param errorCode Specific conflict error code
   * @param message Custom conflict message
   */
  static conflict(errorCode: number, message: string) {
    return {
      status: 409,
      description: 'Conflict',
      examples: {
        'Error: Conflict': {
          value: {
            status: {
              code: 409,
              message: 'Conflict',
            },
            error: {
              code: errorCode,
              message,
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * 500 Internal Server Error
   */
  static internalServerError() {
    return {
      status: 500,
      description: 'Internal Server Error',
      examples: {
        'Error: Internal Server Error': {
          value: {
            status: {
              code: 500,
              message: 'Internal Server Error',
            },
            error: {
              code: ERROR_CODE.INTERNAL_SERVER_ERROR,
              message: ERROR_MESSAGE[ERROR_CODE.INTERNAL_SERVER_ERROR],
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }

  /**
   * Custom error response
   * @param status HTTP status code
   * @param errorCode Application error code
   * @param message Error message
   * @param description Swagger description
   */
  static customError(
    status: number,
    errorCode: number,
    message: string,
    description: string = 'Error',
  ) {
    return {
      status,
      description,
      examples: {
        [`Error: ${description}`]: {
          value: {
            status: {
              code: status,
              message: description,
            },
            error: {
              code: errorCode,
              message,
              errors: [],
            },
            path: '/api/v1/...',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };
  }
}
