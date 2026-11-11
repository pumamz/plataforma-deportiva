import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3002),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5174'),
  JWT_SECRET: z.string().min(24).default('development-only-change-me'),
  ENABLE_SCHEMA_SYNC: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  SEED_DEMO: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
});

export const config = schema.parse(process.env);
if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'development-only-change-me') throw new Error('JWT_SECRET is required in production');
if (config.NODE_ENV === 'production' && (config.ENABLE_SCHEMA_SYNC || config.SEED_DEMO)) throw new Error('Schema sync and demo seed are forbidden in production');
