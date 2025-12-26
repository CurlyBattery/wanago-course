import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  async hash(raw: string): Promise<string> {
    if (!raw) {
      throw new Error('Row is required');
    }

    try {
      return argon2.hash(raw);
    } catch (e: unknown) {
      console.error(`Failed to hash: ${e}`);
      throw new Error('Failed to hash');
    }
  }

  async verify(raw: string, hashed: string): Promise<boolean> {
    if (!raw || !hashed) {
      throw new Error('Row and hashed is required');
    }

    try {
      return argon2.verify(hashed, raw);
    } catch (e: unknown) {
      console.error(`Failed to verify: ${e}`);
      throw new Error('Failed to hash');
    }
  }
}
