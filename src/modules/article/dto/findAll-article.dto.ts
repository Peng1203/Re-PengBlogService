import { ListCommonParamsDto } from '@/common/dto';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/helper/enums';
import { IsEnum, IsInt, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllArticleDto extends ListCommonParamsDto {
  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  @ApiProperty({ required: false, description: '文章类型' })
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
}
