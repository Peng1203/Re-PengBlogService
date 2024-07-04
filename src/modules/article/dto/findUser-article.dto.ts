import { ListCommonParamsDto } from '@/common/dto'
import { IsEnum, IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

enum ResponseType {
  /** 文章列表 */
  LIST = 1,
  /** 文章详情 */
  OPTIONS = 2,
}

export class FindUserArticleDto extends ListCommonParamsDto {
  @IsOptional()
  @IsEnum(ResponseType)
  @ApiProperty({
    enum: ResponseType,
    default: ResponseType.LIST,
    required: false,
    description: '响应类型',
  })
  type?: ResponseType
}
