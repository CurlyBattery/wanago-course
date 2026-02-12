import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const LoginSchema = z.object({
  email: z.string().includes('@'),
  password: z.string().min(6),
});

export class LoginDto extends createZodDto(LoginSchema) {}
