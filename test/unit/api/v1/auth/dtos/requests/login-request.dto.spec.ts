import { validate } from 'class-validator';
import { LoginRequestDto } from '../../../../../../../src/api/v1/auth/dtos/requests/login-request.dto';

describe('LoginRequestDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new LoginRequestDto();
    dto.username = '0812345678';
    dto.password = 'password';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if username is empty', async () => {
    const dto = new LoginRequestDto();
    dto.password = 'password';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });

  it('should fail validation if password is empty', async () => {
    const dto = new LoginRequestDto();
    dto.username = '0812345678';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
