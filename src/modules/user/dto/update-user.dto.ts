import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEnabledEnum } from '@/helper/enums';
import { IsArrayNumber } from '@/common/validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '用户名称' })
  @IsOptional()
  readonly userName?: string;

  @IsInt()
  @IsNumber()
  @IsEnum(UserEnabledEnum)
  @ApiProperty({ description: '用户状态 0禁用 1启用', default: UserEnabledEnum.Enabled })
  @IsOptional()
  readonly userEnabled?: UserEnabledEnum;

  @IsArray()
  @Validate(IsArrayNumber)
  @ApiProperty({ description: '用户角色id数组', default: [] })
  @IsOptional()
  readonly roleIds?: number[];

  @IsEmail()
  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  readonly email?: string;

  @IsString()
  @ApiProperty({ description: '昵称' })
  @IsOptional()
  readonly nickName?: string;

  @IsString()
  @ApiProperty({ description: '用户头像' })
  @IsOptional()
  readonly userAvatar?: string;
}
