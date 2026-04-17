import { ERROR_CODE } from '@app/constants/error-code.constant';
import { ERROR_MESSAGE } from '@app/constants/error-message.constant';

/**
 * Swagger response helpers for consistent API documentation.
 */
export class SwaggerHelpers {
  static success(status: number, example: unknown, description: string = 'Success') {
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

  static paginated<T>(
    items: T[],
    description: string = 'Success',
    page: number = 1,
    perPage: number = 10,
    total?: number,
  ) {
    const totalItems = total ?? items.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const data = {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: perPage,
        totalPages,
        currentPage: page,
      },
      links: {
        first: `http://localhost:3000/api/v1/resource?page=1&perPage=${perPage}`,
        previous:
          page > 1
            ? `http://localhost:3000/api/v1/resource?page=${page - 1}&perPage=${perPage}`
            : '',
        next:
          page < totalPages
            ? `http://localhost:3000/api/v1/resource?page=${page + 1}&perPage=${perPage}`
            : '',
        last: `http://localhost:3000/api/v1/resource?page=${totalPages}&perPage=${perPage}`,
      },
    };

    return this.success(200, data, description);
  }
}
