import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '#modules/user/controllers/user.controller';
import { UserService } from '#modules/user/services/user.service';
import { JwtAuthGuard } from '#modules/auth/guards/jwt-auth.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const mockUserService = {
    findAll: jest.fn().mockResolvedValue({
      items: [
        { id: '1', email: 'a', mobile: '1', fullName: 'A', isActive: true },
      ],
      meta: {
        itemCount: 1,
        totalItems: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
      links: {},
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({
        items: [
          { id: '1', email: 'a', mobile: '1', fullName: 'A', isActive: true },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      });
  });
});
