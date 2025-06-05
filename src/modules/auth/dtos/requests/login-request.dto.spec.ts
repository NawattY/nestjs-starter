import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginRequestDto } from './login-request.dto';

describe('LoginRequestDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(LoginRequestDto, {
      username: 'user@example.com',
      password: 'pass',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails with empty fields', async () => {
    const dto = plainToInstance(LoginRequestDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
