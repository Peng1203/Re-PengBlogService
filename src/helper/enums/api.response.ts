export enum ApiResponseCodeEnum {
  SUCCESS = 20000,
  CREATED = 20100,
  NOCONTENT = 20400,
  BADREQUEST = 40000,
  UNAUTHORIZED = 40100,
  FORBIDDEN = 40300,
  NOTFOUND = 40400,
  INTERNALSERVERERROR = 50000,
}

export const ApiResponseMessageEnum = {
  [ApiResponseCodeEnum.SUCCESS]: "操作成功",
  [ApiResponseCodeEnum.CREATED]: "创建成功",
  [ApiResponseCodeEnum.NOCONTENT]: "没有内容",
  [ApiResponseCodeEnum.BADREQUEST]: "客户端请求错误",
  [ApiResponseCodeEnum.UNAUTHORIZED]: "未授权访问",
  [ApiResponseCodeEnum.FORBIDDEN]: "禁止访问",
  [ApiResponseCodeEnum.NOTFOUND]: "资源不存在",
  [ApiResponseCodeEnum.INTERNALSERVERERROR]: "服务器内部错误",
};