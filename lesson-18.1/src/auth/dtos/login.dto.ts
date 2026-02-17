import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const loginDtoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export class LoginDto extends createZodDto(loginDtoSchema) {}
