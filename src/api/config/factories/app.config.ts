import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'ddd-nestjs-template',
  env: (process.env.NODE_ENV ?? 'development') as
    | 'development'
    | 'test'
    | 'production',
}));
