import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/api/modules/app.module';

describe('AppInfoController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /info should return 200 and a validated payload', () => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          status: string;
          serviceName: string;
          version: string;
          startedAt: string;
        };
        expect(body.status).toBe('ok');
        expect(body.serviceName).toBe('ddd-nestjs-template');
        expect(body.version).toBe('0.0.1');
        expect(typeof body.startedAt).toBe('string');
        expect(new Date(body.startedAt).toString()).not.toBe('Invalid Date');
      });
  });
});
