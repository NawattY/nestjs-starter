import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from '../file-upload.service';
import { FileUploadStrategy } from '../strategies/file-upload.strategy';

class MockStrategy implements FileUploadStrategy {
  upload = jest.fn(async () => '/uploads/test.txt');
}

describe('FileUploadService', () => {
  let service: FileUploadService;
  let strategy: MockStrategy;

  beforeEach(async () => {
    strategy = new MockStrategy();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        { provide: FileUploadStrategy, useValue: strategy },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should upload using strategy', async () => {
    const file = { originalname: 'test.txt', buffer: Buffer.from('data') } as any;
    const url = await service.upload(file);
    expect(url).toBe('/uploads/test.txt');
    expect(strategy.upload).toHaveBeenCalledWith(file);
  });
});
