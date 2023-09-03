import * as expressSession from 'express-session';

declare module 'express-session' {
  interface SessionInfo {
    cookie: any;
    captcha?: string;
    expirationTimestamp?: number;
  }
}

// 声明 express-session 模块的导出类型
// declare module 'express-session' {
//   interface SessionData {
//     info: SessionInfo; // 将 info 属性声明为 SessionInfo 类型
//   }
// }

export = expressSession; // 导出整个 express-session 模块
