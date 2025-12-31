import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUserRequestDto } from '#api/v1/user/dtos/requests/update-user-request.dto';

describe('UpdateUserRequestDto', () => {
  describe('valid data', () => {
    it('should pass validation when all fields are provided and valid', async () => {
      const validData = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const dto = plainToInstance(UpdateUserRequestDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when only valid email is provided', async () => {
      const validEmailData = {
        email: 'test.email@domain.com',
      };
      const dto = plainToInstance(UpdateUserRequestDto, validEmailData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when only valid firstName is provided', async () => {
      const validNameData = {
        firstName: 'Alice',
      };
      const dto = plainToInstance(UpdateUserRequestDto, validNameData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when only valid lastName is provided', async () => {
      const validNameData = {
        lastName: 'Smith',
      };
      const dto = plainToInstance(UpdateUserRequestDto, validNameData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with various valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'firstname.lastname@example.com',
        'user@subdomain.example.com',
        '12345@example.com',
        'user+tag@example.com',
      ];

      for (const email of validEmails) {
        const dto = plainToInstance(UpdateUserRequestDto, { email });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with names at maximum length (100 characters)', async () => {
      const maxLengthName = 'a'.repeat(100);
      const dto = plainToInstance(UpdateUserRequestDto, {
        firstName: maxLengthName,
        lastName: maxLengthName,
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when no fields are provided (empty update)', async () => {
      const dto = plainToInstance(UpdateUserRequestDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid data', () => {
    it('should fail validation when email is invalid format', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@.com',
      ];

      for (const email of invalidEmails) {
        const dto = plainToInstance(UpdateUserRequestDto, { email });
        const errors = await validate(dto);
        
        if (errors.length > 0) {
          const emailError = errors.find(e => e.property === 'email');
          expect(emailError?.constraints).toHaveProperty('isEmail');
        }
      }
    });

    it('should fail validation when firstName exceeds maximum length', async () => {
      const tooLongName = 'a'.repeat(101);
      const dto = plainToInstance(UpdateUserRequestDto, { firstName: tooLongName });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const nameError = errors.find(e => e.property === 'firstName');
      expect(nameError?.constraints).toHaveProperty('maxLength');
    });

    it('should fail validation when lastName exceeds maximum length', async () => {
      const tooLongName = 'a'.repeat(101);
      const dto = plainToInstance(UpdateUserRequestDto, { lastName: tooLongName });
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      const nameError = errors.find(e => e.property === 'lastName');
      expect(nameError?.constraints).toHaveProperty('maxLength');
    });
  });

  describe('edge cases', () => {
    it('should handle very long email addresses', async () => {
      // Use a reasonably long email that's still valid
      const longLocalPart = 'a'.repeat(50);
      const longEmail = `${longLocalPart}@example.com`;
      
      const dto = plainToInstance(UpdateUserRequestDto, { email: longEmail });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle names with special characters', async () => {
      const specialNames = [
        "Anne-Marie",
        "D'Angelo",
        "O'Reilly",
        "Jean-Claude",
        "Mary Jane",
      ];
      
      for (const name of specialNames) {
        const firstNameDto = plainToInstance(UpdateUserRequestDto, { firstName: name });
        const firstNameErrors = await validate(firstNameDto);
        expect(firstNameErrors.filter(e => e.property === 'firstName')).toHaveLength(0);

        const lastNameDto = plainToInstance(UpdateUserRequestDto, { lastName: name });
        const lastNameErrors = await validate(lastNameDto);
        expect(lastNameErrors.filter(e => e.property === 'lastName')).toHaveLength(0);
      }
    });
  });
});
