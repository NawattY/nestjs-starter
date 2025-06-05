import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated users', async () => {
    const query = { page: 1, perPage: 10 } as any;
    const data = {
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
    };
    mockUserService.findAll.mockResolvedValue(data);

    const result = await controller.findAll(query);

    expect(result).toEqual(data);
    expect(mockUserService.findAll).toHaveBeenCalledWith(query);
  });

  it('should propagate errors from UserService.findAll', async () => {
    const query = { page: 1, perPage: 10 } as any;
    mockUserService.findAll.mockRejectedValue(new Error('nope'));

    await expect(controller.findAll(query)).rejects.toThrow('nope');
  });
});
