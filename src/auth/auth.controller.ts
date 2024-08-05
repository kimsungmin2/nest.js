import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';
import { KakaoAuthGuard } from 'src/utils/guard/kakao.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 계정으로 로그인 하세요.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  @HttpCode(HttpStatus.FOUND)
  redirectToKakaoAuth(@Res() res): void {
    const KAKAO_REST_API_KEY =
      this.configService.get<string>('KAKAO_CLIENT_ID');
    const KAKAO_REDIRECT_URI =
      this.configService.get<string>('KAKAO_REDIRECT_URI');
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

    res.redirect(kakaoAuthURL);
  }

  @UseGuards(KakaoAuthGuard)
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
}
