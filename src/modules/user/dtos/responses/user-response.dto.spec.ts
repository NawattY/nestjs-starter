import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

describe('UserResponseDto', () => {
  it('exposes only defined fields', () => {
    const dto = plainToInstance(
      UserResponseDto,
      {
        id: '1',
        email: 'a',
        mobile: '1',
        fullName: 'A',
        isActive: true,
        extra: 'x',
      },
      { excludeExtraneousValues: true },
    );

    expect(dto).toEqual({
      id: '1',
      email: 'a',
      mobile: '1',
      fullName: 'A',
      isActive: true,
    });
    expect((dto as any).extra).toBeUndefined();
  });

  it('returns empty object when no data provided', () => {
    const dto = plainToInstance(UserResponseDto, {}, { excludeExtraneousValues: true });
    expect(dto).toEqual({});
  });
});
