import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  async hash(raw: string) {
    try {
      return argon2.hash(raw);
    } catch (e: unknown) {
      console.error('Error hashing raw ', e);
      throw new BadRequestException('Error hashing raw');
    }
  }

  async verify(raw: string, hashed: string) {
    try {
      return argon2.verify(raw, hashed);
    } catch (e: unknown) {
      console.error('Error matching raws', e);
      throw new BadRequestException('Error matching raws');
    }
  }
}
