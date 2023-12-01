import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import {
  ArrayMaxSize,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatusEnum, ArticleTypeEnum, BolEnum } from '@/helper/enums';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false, description: '文章标题' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: '文章内容' })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: '文章封面' })
  cover?: string | null;

  // @IsNumber()
  // @IsInt()
  // @IsOptional()
  // @ApiProperty({ required: false, description: '作者ID' })
  // authorId?: number;

  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: '文章类型: 1原创 2转载 3翻译',
  })
  type?: ArticleTypeEnum;

  @IsEnum(ArticleStatusEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: '文章状态: 1已发布 2私密 3草稿箱 4已删除 5待审核 6已拒绝',
  })
  status?: ArticleStatusEnum;

  @IsEnum(BolEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: '是否置顶: 0否 1是',
  })
  isTop?: BolEnum;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, description: '分类ID' })
  category?: number | null;

  @IsNumber({}, { each: true })
  @ArrayMaxSize(3)
  @IsOptional()
  @ApiProperty({ required: false, default: [], description: '文章标签' })
  tags?: number[];
}
