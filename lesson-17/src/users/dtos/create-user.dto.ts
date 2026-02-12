import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
