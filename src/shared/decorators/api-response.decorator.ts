import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import type { ApiResponseOptions } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

type ExtendedApiResponseOptions = ApiResponseOptions & {
  type?: Type<unknown>;
};

export function ApiResponses(
  responses: ExtendedApiResponseOptions[],
): ReturnType<typeof applyDecorators> {
  const decorators = responses.map((res) => ApiResponse(res));
  return applyDecorators(...decorators);
}
