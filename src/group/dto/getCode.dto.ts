import { ApiProperty } from '@nestjs/swagger';

export class GetSearchDto {
  @ApiProperty({ example: 'uuid' })
  code: string;

  @ApiProperty({ example: '신앙 대학교 목탁 학과' })
  search: string;
}
