import { validate } from 'class-validator';
import { LineLoginRequestDto } from '../../../../../../../src/api/v1/auth/dtos/requests/line-login-request.dto';

describe('LineLoginRequestDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new LineLoginRequestDto();
    dto.lineUserId = 'line123';
    dto.displayName = 'John Doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if lineUserId is empty', async () => {
    const dto = new LineLoginRequestDto();
    dto.displayName = 'John Doe';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('lineUserId');
  });

  it('should pass validation if displayName is missing (optional)', async () => {
    const dto = new LineLoginRequestDto();
    dto.lineUserId = 'line123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
