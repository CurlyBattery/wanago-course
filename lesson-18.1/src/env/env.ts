import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),

  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),

  ACCESS_SECRET: z.string(),
  ACCESS_EXP: z.string(),
  REFRESH_SECRET: z.string(),
  REFRESH_EXP: z.string(),

  SUBSCRIBERS_SERVICE_HOST: z.string(),
  SUBSCRIBERS_SERVICE_PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;
