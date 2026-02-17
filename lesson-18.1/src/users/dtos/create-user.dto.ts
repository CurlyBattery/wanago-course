import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createUserDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export class CreateUserDto extends createZodDto(createUserDtoSchema) {}
