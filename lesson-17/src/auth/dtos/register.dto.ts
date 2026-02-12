import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterSchema = z.object({
  username: z.string(),
  email: z.string().includes('@'),
  password: z.string().min(6),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
