import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updatePostDtoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export class UpdatePostDto extends createZodDto(updatePostDtoSchema) {}
