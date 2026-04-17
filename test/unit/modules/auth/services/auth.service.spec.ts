import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../../../../../src/modules/auth/application/auth.service';
import { JwtService } from '../../../../../src/core/auth/jwt.service';
import { AppException } from '../../../../../src/shared/exceptions/app.exception';
import { LoginInput } from '../../../../../src/modules/auth/application/models/inputs/login.input';
import { RefreshTokenInput } from '../../../../../src/modules/auth/application/models/inputs/refresh-token.input';
import { AUTH_DATASOURCE } from '../../../../../src/modules/auth/infrastructure/datasources/auth.datasource.interface';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    signRefresh: jest.fn(),
    signAccess: jest.fn(),
    verifyRefresh: jest.fn(),
  };

  const mockAuthDataSource = {
    findUserByMobile: jest.fn(),
    createSession: jest.fn(),
    findSession: jest.fn(),
    revokeSession: jest.fn(),
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AUTH_DATASOURCE, useValue: mockAuthDataSource },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('loginWithPassword', () => {
    it('should return tokens on success', async () => {
      const user = { userId: '1', hasPassword: true, password: 'hashedPassword' };
      mockAuthDataSource.findUserByMobile.mockResolvedValue(user);
      mockJwtService.signRefresh.mockReturnValue('refresh_token');
      mockJwtService.signAccess.mockReturnValue('access_token');
      mockAuthDataSource.createSession.mockResolvedValue({ id: 'session_id' });

      const result = await service.loginWithPassword(
        new LoginInput({
          mobile: '0812345678',
          password: 'password',
          userAgent: 'ua',
          ip: 'ip',
        }),
      );

      expect(result).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token' });
      expect(mockAuthDataSource.createSession).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      mockAuthDataSource.findUserByMobile.mockResolvedValue(null);
      await expect(
        service.loginWithPassword(
          new LoginInput({
            mobile: '0812345678',
            password: 'password',
            userAgent: 'ua',
            ip: 'ip',
          }),
        ),
      ).rejects.toThrow(AppException);
    });

    it('should throw if password mismatch', async () => {
      const user = { userId: '1', hasPassword: true, password: 'hashedPassword' };
      mockAuthDataSource.findUserByMobile.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.loginWithPassword(
          new LoginInput({
            mobile: '0812345678',
            password: 'wrong',
            userAgent: 'ua',
            ip: 'ip',
          }),
        ),
      ).rejects.toThrow(AppException);
    });
  });

  describe('refresh', () => {
    it('should return new tokens on success', async () => {
      const payload = { sid: 'session_id', uid: '1' };
      mockJwtService.verifyRefresh.mockReturnValue(payload);
      const session = { 
        refreshTokenHash: 'hash', 
        isActive: () => true 
      };
      mockAuthDataSource.findSession.mockResolvedValue(session);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signRefresh.mockReturnValue('new_refresh_token');
      mockJwtService.signAccess.mockReturnValue('new_access_token');
      mockAuthDataSource.createSession.mockResolvedValue({ id: 'new_session_id' });

      const result = await service.refresh(
        new RefreshTokenInput({
          refreshToken: 'refresh_token',
          userAgent: 'ua',
          ip: 'ip',
        }),
      );

      expect(result).toEqual({ accessToken: 'new_access_token', refreshToken: 'new_refresh_token' });
    });

    it('should throw if refresh token invalid', async () => {
      mockJwtService.verifyRefresh.mockImplementation(() => { throw new Error('Invalid refresh token'); });
      await expect(
        service.refresh(
          new RefreshTokenInput({
            refreshToken: 'invalid',
            userAgent: 'ua',
            ip: 'ip',
          }),
        ),
      ).rejects.toThrow(AppException);
    });

    it('should throw if session not found', async () => {
      mockJwtService.verifyRefresh.mockReturnValue({ sid: 'session_id', uid: '1' });
      mockAuthDataSource.findSession.mockResolvedValue(null);
      await expect(
        service.refresh(
          new RefreshTokenInput({
            refreshToken: 'token',
            userAgent: 'ua',
            ip: 'ip',
          }),
        ),
      ).rejects.toThrow(AppException);
    });

    it('should revoke session if token mismatch (reuse detection)', async () => {
      mockJwtService.verifyRefresh.mockReturnValue({ sid: 'session_id', uid: '1' });
      const session = { 
        refreshTokenHash: 'hash', 
        isActive: () => true 
      };
      mockAuthDataSource.findSession.mockResolvedValue(session);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refresh(
          new RefreshTokenInput({
            refreshToken: 'token',
            userAgent: 'ua',
            ip: 'ip',
          }),
        ),
      ).rejects.toThrow(AppException);
      expect(mockAuthDataSource.revokeSession).toHaveBeenCalledWith('session_id');
    });
  });

  describe('logout', () => {
    it('should revoke session', async () => {
      await service.logout('session_id');
      expect(mockAuthDataSource.revokeSession).toHaveBeenCalledWith('session_id');
    });
  });

  describe('getUserById', () => {
    it('should return user', async () => {
      const user = { userId: '1', hasPassword: true };
      mockAuthDataSource.findUserById.mockResolvedValue(user);
      const result = await service.getUserById('1');
      expect(result).toEqual(user);
    });

    it('should throw if user not found', async () => {
      mockAuthDataSource.findUserById.mockResolvedValue(null);
      await expect(service.getUserById('1')).rejects.toThrow(AppException);
    });
  });
});
