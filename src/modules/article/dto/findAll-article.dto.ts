import { ListCommonParamsDto } from '@/common/dto';
import { ArticleTypeEnum } from '@/helper/enums';
import { IsEnum, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllArticleDto extends ListCommonParamsDto {
  @IsEnum(ArticleTypeEnum)
  @IsOptional()
  @ApiProperty({ description: '文章类型名', default: '' })
  type: ArticleTypeEnum | '';
}
