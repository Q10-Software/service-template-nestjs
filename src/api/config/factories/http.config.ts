import { registerAs } from '@nestjs/config'

export default registerAs('http', () => ({
  port: Number(process.env.PORT ?? 3000)
}))
