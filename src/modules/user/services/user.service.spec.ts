import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';

const mockRepo = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: mockRepo }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find by email when username includes @', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.com' });

    const result = await service.findByUsername('a@b.com');

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('a@b.com');
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('should find by id when username has no @', async () => {
    mockRepo.findById.mockResolvedValue({ id: '1' });

    const result = await service.findByUsername('1');

    expect(mockRepo.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should return paginated result in findAll', async () => {
    const repoResult = {
      items: [{ id: '1', email: 'a', mobile: '1', fullName: 'A', isActive: true }],
      meta: {
        itemCount: 1,
        totalItems: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
      links: {},
    };
    mockRepo.findAll.mockResolvedValue(repoResult);

    const result = await service.findAll({ page: 1, perPage: 10 });

    expect(result.meta.totalItems).toBe(1);
    expect(result.items[0]).toEqual(
      expect.objectContaining({ id: '1', email: 'a' }),
    );
  });
});
