import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from './auth-response.dto';

describe('AuthResponseDto', () => {
  it('transforms plain object to class instance', () => {
    const dto = plainToInstance(AuthResponseDto, {
      accessToken: 'token',
      userId: '1',
    });

    expect(dto).toBeInstanceOf(AuthResponseDto);
    expect(dto).toEqual({ accessToken: 'token', userId: '1' });
  });

  it('drops fields when excludeExtraneousValues is set', () => {
    const dto = plainToInstance(
      AuthResponseDto,
      { accessToken: 'token', userId: '1' },
      { excludeExtraneousValues: true },
    );
    expect(dto).toEqual({});
  });
});
