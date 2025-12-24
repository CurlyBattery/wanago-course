import { MinioBucketConfig } from './minio-bucket-config.interface';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface MinioModuleOptions {
  endpoint: string;
  port?: number;
  useSSL?: boolean;
  accessKey: string;
  secretKey: string;
  region?: string;
  buckets?: MinioBucketConfig[];
}

export interface MinioOptionsFactory {
  createMinioOptions(): Promise<MinioModuleOptions> | MinioModuleOptions;
}

export interface MinioModuleAsyncOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  useExisting?: Type<MinioOptionsFactory>;
  useClass?: Type<MinioOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MinioModuleOptions> | MinioModuleOptions;
  inject?: any[];
}
