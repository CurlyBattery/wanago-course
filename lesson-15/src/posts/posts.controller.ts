import { Controller, Get } from '@nestjs/common';

import { Public } from '@app/app/auth/public.decorator';

@Controller('posts')
export class PostsController {
  @Public()
  @Get()
  findAll() {
    return {
      id: '1',
    };
  }
}
