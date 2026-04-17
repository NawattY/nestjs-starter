import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { JwtPayload } from '@app/core/auth/jwt-payload.interface';
import { AuthService } from '@app/modules/auth/application/auth.service';
import { AuthController } from '@app/modules/auth/api/controllers/auth.controller';
import { JwtAuthGuard } from '@app/core/auth/jwt-auth.guard';
import { ROUTES } from '@app/routes/app-routes.constant';

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
        canActivate: (context: import('@nestjs/common').ExecutionContext) => {
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
    return request(app.getHttpServer())
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.LOGIN}`)
      .send({ username: 'a', password: 'b' })
      .expect(201)
      .expect({ accessToken: 'token', refreshToken: 'refresh' });
  });

  it('/v1/auth/me (GET)', () => {
    return request(app.getHttpServer())
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
    return request(app.getHttpServer())
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.REFRESH}`)
      .send({ refreshToken: 'refresh' })
      .expect(201)
      .expect({ accessToken: 'new', refreshToken: 'refresh' });
  });

  it('/v1/auth/logout (POST)', () => {
    return request(app.getHttpServer())
      .post(`/${ROUTES.V1.AUTH.ROOT}/${ROUTES.V1.AUTH.LOGOUT}`)
      .set('Authorization', 'Bearer token')
      .expect(204)
      .expect('');
  });
});
