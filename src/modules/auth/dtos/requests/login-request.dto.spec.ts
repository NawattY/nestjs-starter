import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginRequestDto } from './login-request.dto';

describe('LoginRequestDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(LoginRequestDto, {
      username: 'john',
      password: 'secret',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails validation when required fields missing', async () => {
    const dto = plainToInstance(LoginRequestDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
