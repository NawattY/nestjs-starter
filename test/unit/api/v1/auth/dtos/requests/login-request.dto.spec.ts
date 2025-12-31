import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginRequestDto } from '#api/v1/auth/dtos/requests/login-request.dto';

describe('LoginRequestDto', () => {
  let validLoginData = {
    username: '0990090099',
    password: '123456',
  };

  describe('valid data', () => {
    it('should pass validation with valid username and password', async () => {
      const dto = plainToInstance(LoginRequestDto, validLoginData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with various valid usernames', async () => {
      const validUsernames = ['0990090099', 'user@example.com', 'testuser123'];

      for (const username of validUsernames) {
        const dto = plainToInstance(LoginRequestDto, {
          ...validLoginData,
          username,
        });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with various valid passwords', async () => {
      const validPasswords = ['123456', 'password123', 'P@ssw0rd'];

      for (const password of validPasswords) {
        const dto = plainToInstance(LoginRequestDto, {
          ...validLoginData,
          password,
        });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('invalid data', () => {
    it('should fail validation when username is missing', async () => {
      const dto = plainToInstance(LoginRequestDto, {
        password: validLoginData.password,
      });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const usernameError = errors.find(e => e.property === 'username');
      expect(usernameError).toBeDefined();
      expect(usernameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when username is empty string', async () => {
      const dto = plainToInstance(LoginRequestDto, {
        username: '',
        password: validLoginData.password,
      });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const usernameError = errors.find(e => e.property === 'username');
      expect(usernameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when password is missing', async () => {
      const dto = plainToInstance(LoginRequestDto, {
        username: validLoginData.username,
      });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when password is empty string', async () => {
      const dto = plainToInstance(LoginRequestDto, {
        username: validLoginData.username,
        password: '',
      });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when both fields are missing', async () => {
      const dto = plainToInstance(LoginRequestDto, {});
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThanOrEqual(2);
      
      const usernameError = errors.find(e => e.property === 'username');
      const passwordError = errors.find(e => e.property === 'password');
      
      expect(usernameError).toBeDefined();
      expect(passwordError).toBeDefined();
    });
  });
});
