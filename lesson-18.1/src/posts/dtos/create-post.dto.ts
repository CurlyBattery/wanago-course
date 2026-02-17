import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createPostDtoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export class CreatePostDto extends createZodDto(createPostDtoSchema) {}
