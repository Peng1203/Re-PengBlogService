import { ListCommonParamsDto } from '@/common/dto';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/helper/enums';
import { DATE_TIME_REGEX } from '@/helper/regex';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllArticleDto extends ListCommonParamsDto {
  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  @ApiProperty({ required: false, description: '文章类型', enum: ArticleTypeEnum })
  type?: ArticleTypeEnum;

  @IsEnum(ArticleStatusEnum)
  @IsOptional()
  @ApiProperty({ required: false, description: '文章状态' })
  status?: ArticleStatusEnum;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '作者ID', default: 0 })
  authorId: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '分类ID', default: 0 })
  categoryId: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '标签ID', default: 0 })
  tagId: number;

  @IsString()
  @IsDateString()
  // @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  @ApiProperty({ required: false, description: '开始时间', default: null })
  createdTime?: string;

  @IsString()
  @IsDateString()
  // @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  @ApiProperty({ required: false, description: '结束时间', default: null })
  updateTime?: string;
}
