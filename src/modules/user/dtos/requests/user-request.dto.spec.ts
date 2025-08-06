import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRequestDto } from './user-request.dto';
import { DEFAULT_PAGINATION } from '#constants/pagination.constant';

describe('UserRequestDto', () => {
  it('transforms values correctly', async () => {
    const dto = plainToInstance(UserRequestDto, {
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
