import { validate } from 'class-validator';
import { RefreshRequestDto } from '../../../../../../../src/api/v1/auth/dtos/requests/refresh-request.dto';

describe('RefreshRequestDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RefreshRequestDto();
    dto.refreshToken = 'some_token';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if refreshToken is empty', async () => {
    const dto = new RefreshRequestDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });
});
