import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
