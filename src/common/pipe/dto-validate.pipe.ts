import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { validate } from '@nestjs/class-validator';
import { plainToClass } from '@nestjs/class-transformer';
import { Reflector } from '@nestjs/core';

// 转换参数列表
const convertProps: string[] = ['page', 'pageSize', 'roleId'];

const options = {
  whitelist: true,
  forbidNonWhitelisted: true,
};
// ValidationPipe 为内置校验管道
@Injectable()
export class DtoValidatePipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // 转换部分query参数
    const { type, metatype } = metadata;
    // console.log('type ----->', type, metatype);

    // 当触发 params 或者 custom 校验直接跳过 或 没有传递Dto校验数据直接返回
    if (type === 'param' || type === 'custom' || !metatype) return value;
    else if (type === 'query') {
      // 当为query查询时 转换部分字段的 数据类型
      for (const key in value) {
        if (convertProps.indexOf(key) >= 0) value[key] = Number(value[key]);
      }
    }

    const errors = await validate(plainToClass(metatype, value), options);
    if (errors.length > 0) {
      const errorMessage = this.flattenErrors(errors);
      throw new BadRequestException(errorMessage);
    }

    return value;
  }

  private flattenErrors(errors: any[]): string {
    return errors
      .map((error) => {
        for (const property in error.constraints) {
          if (error.constraints.hasOwnProperty(property)) {
            return error.constraints[property];
          }
        }
      })
      .join(', ');
  }
}
