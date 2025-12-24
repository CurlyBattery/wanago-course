import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),

  PORT: z.coerce.number(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_TIME: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRATION_TIME: z.string(),

  MINIO_USER: z.string(),
  MINIO_PASSWORD: z.string(),
  MINIO_REGION: z.string(),
  MINIO_ENDPOINT: z.string(),
});

export type Env = z.infer<typeof envSchema>;
