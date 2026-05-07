import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/api/modules/app.module'

describe('AppInfoController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('GET /info should return 200 and a validated payload', () => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          data: {
            status: string
            name: string
            version: string
            startedAt: string
          }
          statusCode: number
        }
        expect(body.data.status).toBe('ok')
        expect(body.data.name).toBe('ddd-nestjs-template')
        expect(body.data.version).toBe('0.0.1')
        expect(typeof body.data.startedAt).toBe('string')
        expect(new Date(body.data.startedAt).toString()).not.toBe('Invalid Date')
      })
  })
})
