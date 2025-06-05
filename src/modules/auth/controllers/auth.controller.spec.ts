import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '#modules/user/entities/user.entity';
import { UserResponseDto } from '../dtos/responses/user-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    revoke: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call AuthService.login on login', async () => {
    const dto = { username: 'a', password: 'b' };
    mockAuthService.login.mockResolvedValue('result');

    const result = await controller.login(dto as any);

    expect(result).toBe('result');
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should propagate errors from AuthService.login', async () => {
    const dto = { username: 'a', password: 'b' };
    mockAuthService.login.mockRejectedValue(new Error('boom'));

    await expect(controller.login(dto as any)).rejects.toThrow('boom');
  });

  it('should call AuthService.refresh on refresh', async () => {
    const dto = { refreshToken: 'token' };
    mockAuthService.refresh.mockResolvedValue({ accessToken: 'new' });

    const result = await controller.refresh(dto as any);

    expect(result).toEqual({ accessToken: 'new' });
    expect(mockAuthService.refresh).toHaveBeenCalledWith('token');
  });

  it('should propagate errors from AuthService.refresh', async () => {
    const dto = { refreshToken: 'token' };
    mockAuthService.refresh.mockRejectedValue(new Error('fail'));

    await expect(controller.refresh(dto as any)).rejects.toThrow('fail');
  });

  it('should call AuthService.revoke on revoke', async () => {
    const dto = { refreshToken: 'token' };
    const user = { id: '1' } as UserEntity;
    mockAuthService.revoke.mockResolvedValue({ success: true });

    const result = await controller.revoke(dto as any, user);

    expect(result).toEqual({ success: true });
    expect(mockAuthService.revoke).toHaveBeenCalledWith('1', 'token');
  });

  it('should propagate errors from AuthService.revoke', async () => {
    const dto = { refreshToken: 'token' };
    const user = { id: '1' } as UserEntity;
    mockAuthService.revoke.mockRejectedValue(new Error('oops'));

    await expect(controller.revoke(dto as any, user)).rejects.toThrow('oops');
  });

  it('should return transformed user on getMe', () => {
    const user: UserEntity = {
      id: '1',
      email: 'a@b.com',
      password: 'hash',
      fullName: 'A',
      isActive: true,
      mobile: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = controller.getMe(user);

    expect(result).toBeInstanceOf(UserResponseDto);
    expect(result).toMatchObject({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    });
  });

  it('should return undefined when user is not provided', () => {
    const result = controller.getMe(undefined as any);
    expect(result).toBeUndefined();
  });
});
