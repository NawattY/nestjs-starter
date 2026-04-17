import { databaseConfiguration } from '@app/config/database.config';

describe('databaseConfiguration', () => {
  const originalEnvironment = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnvironment };
  });

  it('should allow the database URL to be omitted and default connectOnBoot to false', () => {
    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_CONNECT_ON_BOOT;

    expect(databaseConfiguration()).toEqual({
      url: undefined,
      connectOnBoot: false,
    });
  });

  it('should parse connectOnBoot when explicitly enabled', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/example';
    process.env.DATABASE_CONNECT_ON_BOOT = 'true';

    expect(databaseConfiguration()).toEqual({
      url: 'postgresql://localhost:5432/example',
      connectOnBoot: true,
    });
  });
});