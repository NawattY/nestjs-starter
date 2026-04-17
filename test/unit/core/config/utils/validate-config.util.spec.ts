import { z } from 'zod';

import {
  envBooleanSchema,
  envIntegerSchema,
  envMsDurationSchema,
  envStringSchema,
  optionalEnvStringSchema,
  validateAndTransformConfig,
} from '../../../../../src/core/config/utils/validate-config.util';

describe('validate-config util', () => {
  describe('envBooleanSchema', () => {
    it('should coerce common truthy and falsy strings', () => {
      expect(envBooleanSchema.parse('true')).toBe(true);
      expect(envBooleanSchema.parse('1')).toBe(true);
      expect(envBooleanSchema.parse('off')).toBe(false);
      expect(envBooleanSchema.parse('NO')).toBe(false);
    });

    it('should reject unsupported boolean strings', () => {
      expect(() => envBooleanSchema.parse('sometimes')).toThrow();
    });
  });

  describe('envStringSchema', () => {
    it('should trim values and apply defaults', () => {
      const schema = envStringSchema('localhost');

      expect(schema.parse('  api.example.com  ')).toBe('api.example.com');
      expect(schema.parse(undefined)).toBe('localhost');
    });
  });

  describe('optionalEnvStringSchema', () => {
    it('should normalize empty strings to undefined', () => {
      expect(optionalEnvStringSchema.parse('   ')).toBeUndefined();
      expect(optionalEnvStringSchema.parse(undefined)).toBeUndefined();
    });

    it('should preserve non-empty strings', () => {
      expect(optionalEnvStringSchema.parse('  secret  ')).toBe('secret');
    });
  });

  describe('envIntegerSchema', () => {
    it('should coerce strings to integers and apply defaults', () => {
      const schema = envIntegerSchema(3000, 1);

      expect(schema.parse('4000')).toBe(4000);
      expect(schema.parse(undefined)).toBe(3000);
    });

    it('should reject values below the minimum', () => {
      const schema = envIntegerSchema(3000, 1);

      expect(() => schema.parse('0')).toThrow();
    });
  });

  describe('envMsDurationSchema', () => {
    it('should accept valid ms duration strings and apply defaults', () => {
      const schema = envMsDurationSchema('30d');

      expect(schema.parse('15m')).toBe('15m');
      expect(schema.parse(undefined)).toBe('30d');
    });

    it('should reject invalid ms duration strings', () => {
      const schema = envMsDurationSchema('30d');

      expect(() => schema.parse('thirty-days')).toThrow();
    });
  });

  describe('validateAndTransformConfig', () => {
    it('should parse and return validated config data', () => {
      const schema = z.object({
        APP_NAME: z.string().min(1),
        APP_PORT: envIntegerSchema(3000, 1),
      });

      const result = validateAndTransformConfig(
        schema,
        {
          APP_NAME: 'nestjs-starter',
          APP_PORT: '4000',
        },
        'Example Config',
      );

      expect(result).toEqual({
        APP_NAME: 'nestjs-starter',
        APP_PORT: 4000,
      });
    });

    it('should include the namespace and field path in validation errors', () => {
      const schema = z.object({
        APP_NAME: z.string().trim().min(1),
      });

      expect(() =>
        validateAndTransformConfig(
          schema,
          {
            APP_NAME: '   ',
          },
          'Example Config',
        ),
      ).toThrow(
        '[Example Config] Validation failed: APP_NAME: Too small: expected string to have >=1 characters',
      );
    });
  });
});
