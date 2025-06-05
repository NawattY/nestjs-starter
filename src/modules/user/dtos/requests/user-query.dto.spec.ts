import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserQueryDto } from './user-query.dto';
import { DEFAULT_PAGINATION } from '#shared/constants/pagination.constant';

describe('UserQueryDto', () => {
  it('transforms values correctly', async () => {
    const dto = plainToInstance(UserQueryDto, {
      page: '-1',
      perPage: '200',
      isActive: 'true',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.page).toBe(DEFAULT_PAGINATION.PAGE);
    expect(dto.perPage).toBe(DEFAULT_PAGINATION.MAX_LIMIT);
    expect(dto.isActive).toBe(true);
  });
});
