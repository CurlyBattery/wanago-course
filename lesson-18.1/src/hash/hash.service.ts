import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  hash(raw: string) {
    try {
      return argon2.hash(raw);
    } catch (e: unknown) {
      console.error('Error hashed raw ', e);
      throw new Error('Error hashed raw');
    }
  }

  validate(raw: string, hashed: string) {
    try {
      return argon2.verify(raw, hashed);
    } catch (e: unknown) {
      console.error('Error validate raw and hashed ', e);
      throw new Error('Error validate raw and hashed');
    }
  }
}
