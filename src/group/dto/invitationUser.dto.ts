import { ApiProperty } from '@nestjs/swagger';

export class InvitationUser {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '신청한 유저 id',
  })
  @IsNotEmpty({ message: '유저 ID를 입력해주세요.' })
  userId: number;

  @IsString()
  @ApiProperty({
    example: '한살차이 - 임종훈',
    description: '속한 그룹에 보여줄 이름을 입력해주세요',
  })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}
