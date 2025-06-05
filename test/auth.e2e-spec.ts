import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '#modules/auth/controllers/auth.controller';
import { AuthService } from '#modules/auth/services/auth.service';
import { JwtAuthGuard } from '#modules/auth/guards/jwt-auth.guard';
import { UserEntity } from '#modules/user/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      userId: '1',
    }),
    refresh: jest.fn().mockResolvedValue({
      accessToken: 'new',
      refreshToken: 'refresh',
      userId: '1',
    }),
    revoke: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: import('@nestjs/common').ExecutionContext) => {
          const req = context
            .switchToHttp()
            .getRequest<{ user?: Partial<UserEntity> }>();
          req.user = {
            id: '1',
            email: 'a@b.com',
            fullName: 'A',
            isActive: true,
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

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'a', password: 'b' })
      .expect(201)
      .expect({ accessToken: 'token', refreshToken: 'refresh', userId: '1' });
  });

  it('/auth/me (GET)', () => {
    const user: UserEntity = {
      id: '1',
      email: 'a@b.com',
      password: 'hash',
      fullName: 'A',
      isActive: true,
      mobile: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return request(app.getHttpServer()).get('/auth/me').expect(200).expect({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    });
  });

  it('/auth/refresh (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: 'refresh' })
      .expect(201)
      .expect({ accessToken: 'new', refreshToken: 'refresh', userId: '1' });
  });

  it('/auth/revoke (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/revoke')
      .send({ refreshToken: 'refresh' })
      .expect(201)
      .expect('');
  });
});
