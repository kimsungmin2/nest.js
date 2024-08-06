import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
  @ApiProperty({ example: 'uuid' })
  code: number;
}
