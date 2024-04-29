import crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private readonly KEY_LENGTH = 64;
  private readonly INITIAL_PASSWORD: '123456';

  /** 生成密码hash */
  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // 生成随机盐
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);
        const hashKey = derivedKey.toString('hex');
        resolve(`${salt}:${hashKey}`);
      });
    });
  }

  /** 验证密码 */
  verify(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hashKey] = hash.split(':');
      const hashKeyBuff = Buffer.from(hashKey, 'hex');
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err);
        const verifyStatus = crypto.timingSafeEqual(hashKeyBuff, derivedKey);
        resolve(verifyStatus);
      });
    });
  }
}
