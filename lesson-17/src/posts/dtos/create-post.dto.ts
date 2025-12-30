import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreatePostSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
