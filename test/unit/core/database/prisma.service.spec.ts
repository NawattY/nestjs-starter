import type { PrismaDatabaseConfig } from '../../../../src/config/database.config';
import type { CoreConfigService } from '../../../../src/core/config/config.service';
import { PrismaService } from '../../../../src/core/database/prisma.service';

describe('PrismaService', () => {
  it('should throw when database is not configured', async () => {
    const configService = {
      get: jest
        .fn()
        .mockReturnValue({ url: undefined, connectOnBoot: false } satisfies PrismaDatabaseConfig),
    } as unknown as CoreConfigService;

    const prismaService = new PrismaService(configService);

    await expect(prismaService.ensureConnection()).rejects.toMatchObject({
      errorCode: 100503,
      status: 503,
    });
  });

  it('should connect lazily when a database URL exists', async () => {
    const configService = {
      get: jest.fn().mockReturnValue({
        url: 'postgresql://localhost:5432/example',
        connectOnBoot: false,
      } satisfies PrismaDatabaseConfig),
    } as unknown as CoreConfigService;

    const prismaService = new PrismaService(configService);
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValue(prismaService as never);

    await prismaService.ensureConnection();
    await prismaService.ensureConnection();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
