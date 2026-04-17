import { validateCoreConfig } from '@app/core/config/validation';

describe('validateCoreConfig', () => {
  it('should apply defaults and coerce APP_PORT', () => {
    const result = validateCoreConfig({
      APP_NAME: 'nestjs-starter',
      APP_PORT: '4000',
    });

    expect(result).toEqual({
      NODE_ENV: 'local',
      APP_HOST: 'localhost',
      APP_PORT: 4000,
      APP_NAME: 'nestjs-starter',
    });
  });

  it('should reject invalid NODE_ENV values', () => {
    expect(() =>
      validateCoreConfig({
        APP_NAME: 'nestjs-starter',
        NODE_ENV: 'qa',
      }),
    ).toThrow();
  });

  it('should reject non-positive APP_PORT values', () => {
    expect(() =>
      validateCoreConfig({
        APP_NAME: 'nestjs-starter',
        APP_PORT: '0',
      }),
    ).toThrow();
  });
});
