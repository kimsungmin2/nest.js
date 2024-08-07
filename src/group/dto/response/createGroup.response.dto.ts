import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '1604b772-adc0-4212-8a90-81186c57f598' })
  code: string;

  @ApiProperty({ example: '한살차이' })
  name: string;

  @ApiProperty({ example: '크립톤 3팀만 들어오소', required: false })
  comment?: string;

  @ApiProperty({ example: '2024-08-07T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 1 })
  owner: number;
}
