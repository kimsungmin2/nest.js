export class userInfoDto {
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @ApiProperty({ example: '서울대 - 19 임종훈' })
  name: string;
}
