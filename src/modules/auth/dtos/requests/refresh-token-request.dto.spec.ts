import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RefreshTokenRequestDto } from './refresh-token-request.dto';

describe('RefreshTokenRequestDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(RefreshTokenRequestDto, { refreshToken: 'token' });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('fails validation when refreshToken is missing', async () => {
    const dto = plainToInstance(RefreshTokenRequestDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
