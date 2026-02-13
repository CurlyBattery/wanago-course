import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const PaginationPostsParamSchema = z.object({
  offset: z.coerce.number().min(0).optional(),
  limit: z.coerce.number().min(1).optional(),
});

export class PaginationPostsParam extends createZodDto(
  PaginationPostsParamSchema,
) {}
