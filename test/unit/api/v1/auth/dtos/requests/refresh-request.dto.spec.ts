import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RefreshRequestDto } from '#api/v1/auth/dtos/requests/refresh-request.dto';

describe('RefreshRequestDto', () => {
  const validRefreshToken = 'KdV1rYiLXijW5rHDOlHQylMB8VIaFIArMTvb9Zbr4ZJwjwwkuxx3ZZ1AzyKUu0hP';
  let validRefreshData = {
    refreshToken: validRefreshToken,
  };

  describe('valid data', () => {
    it('should pass validation with valid refresh token', async () => {
      const dto = plainToInstance(RefreshRequestDto, validRefreshData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with various valid refresh token formats', async () => {
      const validTokens = [
        'KdV1rYiLXijW5rHDOlHQylMB8VIaFIArMTvb9Zbr4ZJwjwwkuxx3ZZ1AzyKUu0hP',
        'simple-token',
        'token_with_underscores',
        'token-with-dashes',
        'a',
        '1',
      ];

      for (const refreshToken of validTokens) {
        const dto = plainToInstance(RefreshRequestDto, { refreshToken });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('invalid data', () => {
    it('should fail validation when refreshToken is missing', async () => {
      const dto = plainToInstance(RefreshRequestDto, {});
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const tokenError = errors.find(e => e.property === 'refreshToken');
      expect(tokenError).toBeDefined();
      expect(tokenError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when refreshToken is empty string', async () => {
      const dto = plainToInstance(RefreshRequestDto, { refreshToken: '' });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const tokenError = errors.find(e => e.property === 'refreshToken');
      expect(tokenError).toBeDefined();
      expect(tokenError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when refreshToken is null', async () => {
      const dto = plainToInstance(RefreshRequestDto, { refreshToken: null });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const tokenError = errors.find(e => e.property === 'refreshToken');
      expect(tokenError).toBeDefined();
      expect(tokenError?.constraints).toHaveProperty('isString');
    });

    it('should fail validation when refreshToken is not a string', async () => {
      const invalidTypes = [123, {}, [], true, false];
      
      for (const refreshToken of invalidTypes) {
        const dto = plainToInstance(RefreshRequestDto, { refreshToken });
        const errors = await validate(dto);
        
        const tokenError = errors.find(e => e.property === 'refreshToken');
        if (refreshToken !== null) {
          expect(tokenError?.constraints).toHaveProperty('isString');
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very long refresh tokens', async () => {
      const longToken = 'a'.repeat(1000);
      const dto = plainToInstance(RefreshRequestDto, { refreshToken: longToken });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle unicode characters in refresh token', async () => {
      const unicodeTokens = [
        'นาที🌟โทเคน',
        'токен',
        'トークン',
        '🔑🔐🔒',
      ];

      for (const refreshToken of unicodeTokens) {
        const dto = plainToInstance(RefreshRequestDto, { refreshToken });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should handle single character refresh token', async () => {
      const singleCharTokens = ['a', '1', '!', '🌟'];
      
      for (const refreshToken of singleCharTokens) {
        const dto = plainToInstance(RefreshRequestDto, { refreshToken });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
