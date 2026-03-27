import { registerAs } from '@nestjs/config';

function toBoolean(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  return value === '1' || value.toLowerCase() === 'true';
}

export default registerAs('logger', () => {
  const debug = toBoolean(process.env.DEBUG, false);

  return {
    debug,
    level: debug ? 'debug' : 'log',
  };
});
