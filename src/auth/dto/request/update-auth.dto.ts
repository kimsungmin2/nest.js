export class UpDateNameDto {
  @IsString()
  @ApiProperty({
    example: '임종훈',
    description: '이름',
  })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}
