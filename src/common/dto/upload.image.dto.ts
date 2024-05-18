import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '图片资源',
  })
  file: any;
}
