import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number(),

  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_DB: z.string(),

  ACCESS_SECRET: z.string(),
  ACCESS_EXP: z.string(),
  REFRESH_SECRET: z.string(),
  REFRESH_EXP: z.string(),

  MINIO_ENDPOINT: z.string(),
  MINIO_USER: z.string(),
  MINIO_PASSWORD: z.string(),
  MINIO_REGION: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
