import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '#modules/user/services/user.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { AppException } from '#shared/exceptions/app.exception';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

jest.mock('bcryptjs');
jest.mock('uuid');

describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService = { sign: jest.fn() };
  const mockUserService = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
  };
  const mockTokenRepo = {
    createToken: jest.fn(),
    findByToken: jest.fn(),
    revokeToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: RefreshTokenRepository, useValue: mockTokenRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should login successfully', async () => {
    mockUserService.findByUsername.mockResolvedValue({ id: '1', password: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (uuidv4 as jest.Mock).mockReturnValue('refresh');
    mockJwtService.sign.mockReturnValue('token');

    const result = await service.login({ username: 'user', password: 'pass' });

    expect(result).toEqual({ accessToken: 'token', refreshToken: 'refresh', userId: '1' });
    expect(mockTokenRepo.createToken).toHaveBeenCalledWith('1', 'refresh');
  });

  it('should throw when credentials mismatch', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);

    await expect(
      service.login({ username: 'user', password: 'pass' }),
    ).rejects.toBeInstanceOf(AppException);
  });

  it('should refresh token', async () => {
    mockTokenRepo.findByToken.mockResolvedValue({ userId: '1', revokedAt: null });
    mockUserService.findById.mockResolvedValue({ id: '1' });
    mockJwtService.sign.mockReturnValue('new');

    const result = await service.refresh('refresh');
    expect(result).toEqual({ accessToken: 'new' });
  });

  it('should throw when refresh token invalid', async () => {
    mockTokenRepo.findByToken.mockResolvedValue(null);

    await expect(service.refresh('bad')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should revoke token', async () => {
    mockTokenRepo.findByToken.mockResolvedValue({ userId: '1', revokedAt: null });

    const result = await service.revoke('1', 'refresh');
    expect(result).toEqual({ success: true });
    expect(mockTokenRepo.revokeToken).toHaveBeenCalledWith('refresh');
  });

  it('should throw when revoke token invalid', async () => {
    mockTokenRepo.findByToken.mockResolvedValue(null);

    await expect(service.revoke('1', 'bad')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
