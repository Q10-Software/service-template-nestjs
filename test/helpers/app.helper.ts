import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { App } from 'supertest/types'
import { AppModule } from '../../src/api/modules/app.module'
import { validationPipeOptions } from '../../src/api/config/validation/validationPipe.options'

export async function buildApp(): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication<INestApplication<App>>()

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))

  await app.init()
  return app
}
