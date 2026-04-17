import { JwtAuthGuard } from '@app/core/auth/jwt-auth.guard';
import { UserController } from '@app/modules/user/api/controllers/user.controller';
import { UserService } from '@app/modules/user/application/user.service';
import { ROUTES } from '@app/routes/app-routes.constant';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

function getHttpServer(app: INestApplication): Parameters<typeof request>[0] {
  return app.getHttpServer() as unknown as Parameters<typeof request>[0];
}

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const mockUserService = {
    findAll: jest.fn().mockResolvedValue({
      items: [
        {
          id: '1',
          email: 'a@b.com',
          mobile: '1',
          firstName: 'Alice',
          lastName: 'Doe',
          status: 'active',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
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

  it('/v1/users (GET)', () => {
    return request(getHttpServer(app))
      .get(`/${ROUTES.V1.USER.ROOT}`)
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect({
        items: [
          {
            id: '1',
            email: 'a@b.com',
            mobile: '1',
            firstName: 'Alice',
            lastName: 'Doe',
            status: 'active',
            createdAt: '2025-01-15T10:30:00.000Z',
            updatedAt: '2025-01-15T10:30:00.000Z',
          },
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
