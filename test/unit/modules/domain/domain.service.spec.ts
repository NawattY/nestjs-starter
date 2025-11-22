import { Test, TestingModule } from '@nestjs/testing';
import { DomainService } from '../../../../src/modules/domain/domain.service';

describe('DomainService', () => {
  let service: DomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainService],
    }).compile();

    service = module.get<DomainService>(DomainService);
  });

  describe('isDomainAllowed', () => {
    it('should allow localhost', async () => {
      expect(await service.isDomainAllowed('http://localhost:3000')).toBe(true);
    });

    it('should allow api.yourdomain.com', async () => {
      expect(await service.isDomainAllowed('https://api.yourdomain.com')).toBe(true);
    });

    it('should allow *.mydomain.com', async () => {
      expect(await service.isDomainAllowed('sub.mydomain.com')).toBe(true);
    });

    it('should allow *.clientdomain.com', async () => {
      expect(await service.isDomainAllowed('sub.clientdomain.com')).toBe(true);
    });

    it('should deny other domains', async () => {
      expect(await service.isDomainAllowed('google.com')).toBe(false);
    });
  });
});
