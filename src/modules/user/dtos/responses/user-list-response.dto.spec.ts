import "reflect-metadata";
import { plainToInstance } from 'class-transformer';
import { UserListResponseDto } from './user-list-response.dto';
import { UserResponseDto } from './user-response.dto';

describe('UserListResponseDto', () => {
  it('transforms nested items to UserResponseDto', () => {
    const dto = plainToInstance(
      UserListResponseDto,
      {
        items: [
          { id: '1', email: 'a', mobile: '1', fullName: 'A', isActive: true },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      },
      { excludeExtraneousValues: true },
    );

    expect(dto.items[0]).toBeInstanceOf(UserResponseDto);
    expect(dto.items[0]).toMatchObject({
      id: '1',
      email: 'a',
      mobile: '1',
      fullName: 'A',
      isActive: true,
    });
  });

  it('handles missing items gracefully', () => {
    const dto = plainToInstance(
      UserListResponseDto,
      { meta: { itemCount: 0, totalItems: 0 } },
      { excludeExtraneousValues: true },
    );

    expect(dto.items).toBeUndefined();
  });
});
