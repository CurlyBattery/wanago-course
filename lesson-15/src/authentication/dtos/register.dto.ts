import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
