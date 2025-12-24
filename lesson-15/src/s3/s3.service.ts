import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { Express } from 'express';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName = 'avatars';

  constructor(private readonly envService: EnvService) {
    this.s3Client = new S3Client({
      endpoint: envService.get('MINIO_ENDPOINT'),
      region: envService.get('MINIO_REGION'),
      credentials: {
        accessKeyId: envService.get('MINIO_USER'),
        secretAccessKey: envService.get('MINIO_PASSWORD'),
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.setBucketPolicy();
    await this.createBucketIfNotExists();
  }

  private async setBucketPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    try {
      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucketName,
          Policy: JSON.stringify(policy),
        }),
      );
      console.log(`Bucket policy set for ${this.bucketName}`);
    } catch (err) {
      console.error('Error setting bucket policy: ', err);
    }
  }

  private async createBucketIfNotExists() {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );
    } catch (err) {
      if (err.name === 'NotFound') {
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucketName }),
          );
          console.log(`Bucket "${this.bucketName}" create successfully"`);
        } catch (createErr) {
          console.error('Error creating Bucket: ', createErr);
        }
      } else {
        console.error('Error checking Bucket: ', err);
      }
    }
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const key = `${userId}-${Date.now()}.${file.originalname.split('.').pop()}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `http://localhost:9000/${this.bucketName}/${key}`;
  }
}
