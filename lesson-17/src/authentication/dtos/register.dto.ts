import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export class RegisterDto extends createZodDto(RegisterDtoSchema) {}
