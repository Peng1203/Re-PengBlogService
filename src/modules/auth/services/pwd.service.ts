import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class PasswordService {
  private readonly KEY_LENGTH = 64;

  hash(password: string) {
    try {
      return new Promise((resolve, reject) => {
        // 生成随机盐
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
          if (err) reject(err);
          const hashPwd = derivedKey.toString('hex');
          resolve(`${salt}:${hashPwd}`);
        });
      });
    } catch (e) {
      console.log('e', e);
    }
  }
}
