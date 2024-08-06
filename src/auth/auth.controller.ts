import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthGuard } from 'src/utils/guard/kakao.guard';
import { UpDateNameDto } from './dto/request/update-auth.dto';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userInfoDto } from './dto/response/userInfo.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({
  //   summary: '카카오 로그인',
  // })
  // @UseGuards(KakaoAuthGuard)
  // @Get('kakao')
  // @HttpCode(HttpStatus.FOUND)
  // redirectToKakaoAuth(@Res() res): void {
  //   const KAKAO_REST_API_KEY =
  //     this.configService.get<string>('KAKAO_CLIENT_ID');
  //   const KAKAO_REDIRECT_URI =
  //     this.configService.get<string>('KAKAO_REDIRECT_URI');
  //   const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

  //   res.redirect(kakaoAuthURL);
  // }

  @ApiOperation({
    summary: '카카오 로그인 콜백',
  })
  @UseGuards(KakaoAuthGuard)
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: userInfoDto })
  @Get('kakao/callback')
  @HttpCode(HttpStatus.OK)
  async kakaoCallbacks(@Req() req, @Res() res) {
    const accessToken = req.user.accessToken;

    res.cookie('authorization', `Bearer ${accessToken}`, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: false,
      secure: false,
    });
    res.redirect('/');
  }

  @ApiOperation({
    summary: '이름 업데이트',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 201 })
  @Patch('update')
  @ApiBody({ type: UpDateNameDto })
  @HttpCode(HttpStatus.CREATED)
  async updateName(@Body() upDateNameDto: UpDateNameDto, @Req() req) {
    const { userId } = req.user;

    const user = await this.authService.updateName(upDateNameDto, userId);
    return {
      message: '이름 변경에 성공하였습니다.',
      data: user,
    };
  }

  @ApiOperation({
    summary: '유저 회원 탈퇴',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200 })
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() req) {
    const { userId } = req.user;

    const user = await this.authService.deleteName(userId);
    return {
      message: '회원 탈퇴가 성공적으로 요청됐습니다.',
      data: user,
    };
  }
}
