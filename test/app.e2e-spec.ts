import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

describe.skip('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.APP_NAME = 'test';
    process.env.DB_USERNAME = 'a';
    process.env.DB_PASSWORD = 'b';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_REFRESH_SECRET = 'secret';
    const { AppModule } = await import('./../src/app.module');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
