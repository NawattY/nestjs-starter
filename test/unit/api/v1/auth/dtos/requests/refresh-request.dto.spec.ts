import { validate } from 'class-validator';

import { RefreshRequestDto } from '../../../../../../../src/modules/auth/api/dtos/requests/refresh-request.dto';

describe('RefreshRequestDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = Object.assign(new RefreshRequestDto(), {
      refreshToken: 'some_token',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if refreshToken is empty', async () => {
    const dto = new RefreshRequestDto();

    const errors = await validate(dto);
    const firstError = errors[0];

    expect(errors.length).toBeGreaterThan(0);
    expect(firstError?.property).toBe('refreshToken');
  });
});
