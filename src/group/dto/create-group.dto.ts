export class CreateGroupDto {
  @IsString()
  @ApiProperty({
    example: '한살차이',
    description: '그룹 이름',
  })
  @IsNotEmpty({ message: '그룹 이름을 입력해주세요.' })
  name: string;

  @IsString()
  @ApiProperty({
    example: '한살차이 화이팅',
    description: '그룹 설명',
  })
  @IsOptional()
  @IsNotEmpty({ message: '그룹 설명을 입력 해주세요.' })
  comment: string;
}
