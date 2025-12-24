import { Module } from '@nestjs/common';

import { S3Service } from './s3.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
