import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserQueryDto } from './user-query.dto';
import { DEFAULT_PAGINATION } from '#shared/constants/pagination.constant';

describe('UserQueryDto', () => {
  it('transforms and validates correct payload', async () => {
    const dto = plainToInstance(UserQueryDto, {
      page: '2',
      perPage: '5',
      isActive: 'true',
    });

    expect(dto.page).toBe(2);
    expect(dto.perPage).toBe(5);
    expect(dto.isActive).toBe(true);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('uses default pagination values', () => {
    const dto = plainToInstance(UserQueryDto, {});

    expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
    expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
  });

  it('sanitizes invalid values', async () => {
    const dto = plainToInstance(UserQueryDto, {
      page: 'bad',
      perPage: 'x',
      isActive: 'maybe',
    });

    expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
    expect(dto.perPage).toBe(DEFAULT_PAGINATION.LIMIT);
    expect(dto.isActive).toBe(false);
  });
});
