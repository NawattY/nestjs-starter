import type { ExecutionContext, INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { JwtAuthGuard } from '../src/core/auth/jwt-auth.guard';
import type { JwtPayload } from '../src/core/auth/jwt-payload.interface';
import { AuthController } from '../src/modules/auth/api/controllers/auth.controller';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { ROUTES } from '../src/routes/app-routes.constant';

function getHttpServer(app: INestApplication): Parameters<typeof request>[0] {
  return app.getHttpServer() as unknown as Parameters<typeof request>[0];
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const mockAuthService = {
    loginWithPassword: jest.fn().mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
    }),
    refresh: jest.fn().mockResolvedValue({
      accessToken: 'new',
      refreshToken: 'refresh',
    }),
    logout: jest.fn().mockResolvedValue(undefined),
    getUserById: jest.fn().mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      fullName: 'A',
      isActive: true,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
          req.user = {
            uid: '1',
            sid: 'session-1',
          };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/auth/login (POST)', () => {
    return request(getHttpServer(app))
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.LOGIN}`)
      .send({ username: 'a', password: 'b' })
      .expect(201)
      .expect({ accessToken: 'token', refreshToken: 'refresh' });
  });

  it('/v1/auth/me (GET)', () => {
    return request(getHttpServer(app))
      .get(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.ME}`)
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect({
        id: '1',
        email: 'a@b.com',
        fullName: 'A',
        isActive: true,
      });
  });

  it('/v1/auth/refresh (POST)', () => {
    return request(getHttpServer(app))
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.REFRESH}`)
      .send({ refreshToken: 'refresh' })
      .expect(201)
      .expect({ accessToken: 'new', refreshToken: 'refresh' });
  });

  it('/v1/auth/logout (POST)', () => {
    return request(getHttpServer(app))
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.LOGOUT}`)
      .set('Authorization', 'Bearer token')
      .expect(204)
      .expect('');
  });
});
