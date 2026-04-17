import { validate } from 'class-validator';

import { LoginRequestDto } from '../../../../../../../src/modules/auth/api/dtos/requests/login-request.dto';

describe('LoginRequestDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = Object.assign(new LoginRequestDto(), {
      username: '0812345678',
      password: 'password',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if username is empty', async () => {
    const dto = Object.assign(new LoginRequestDto(), {
      password: 'password',
    });

    const errors = await validate(dto);
    const firstError = errors[0];

    expect(errors.length).toBeGreaterThan(0);
    expect(firstError?.property).toBe('username');
  });

  it('should fail validation if password is empty', async () => {
    const dto = Object.assign(new LoginRequestDto(), {
      username: '0812345678',
    });

    const errors = await validate(dto);
    const firstError = errors[0];

    expect(errors.length).toBeGreaterThan(0);
    expect(firstError?.property).toBe('password');
  });
});
