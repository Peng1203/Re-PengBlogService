import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvaterDto {
  @ApiProperty({ type: 'string', format: 'binary', description: '头像图片' })
  file: any;
}
