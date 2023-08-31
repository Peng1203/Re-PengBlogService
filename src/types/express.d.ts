import { User } from '@/modules/user/entities';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
// 扩展 Express 的 Request Response 对象的属性
declare module 'express' {
  interface Response extends ExpressResponse {
    resMsg: string;
  }

  interface Request extends ExpressRequest {
    user: User;
  }
}
