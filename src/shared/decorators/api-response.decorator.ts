import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

type ExtendedApiResponseOptions = ApiResponseOptions & {
  type?: Type<unknown>;
};

export function ApiResponses(
  responses: ExtendedApiResponseOptions[],
): ReturnType<typeof applyDecorators> {
  const decorators = responses.map((res) => ApiResponse(res));
  return applyDecorators(...decorators);
}
