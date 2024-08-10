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
import { UpDateNameDto } from './dto/request/update-auth.dto';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userInfoDto } from './dto/response/userInfo';
import { KakaoAuthGuard } from 'src/utils/guard/kakao.guard';
import { Request, Response } from 'express';

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

  /**
   * 카카오 로그인 콜백(이후 클라이언트 만들어서 테스트 예정)
   * userFlow => 유저 로그인 시도 => 프론트에서 인가 코드받고 , 카카오에서 콜백 받은 후 서버로 콜백 보냄 => 이후 로그인 성공
   * guard에서 email 추출 후 findByEmail로 이미 가입한 유저인지 판단, 이후 없을시 createProviderUser로 보내서 가입 하게함.
   * 이후 createToken에서 refreshToken, accessToken발급하고 refreshToken은 user DB에 업데이트 , accessToken은 클라이언트에게 전달
   * Controller(kakaoCallbacks)
   * Service(createToken, createProviderUser, findByEmail)
   * Repository(findByEmail, createUser, updateToken)
   * RequsetDto()
   * ResponseDto(userInfoDto)
   */
  @ApiOperation({
    summary: '카카오 로그인 콜백',
  })
  @UseGuards(KakaoAuthGuard)
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: userInfoDto })
  @Get('kakao/callback')
  @HttpCode(HttpStatus.OK)
  async kakaoCallbacks(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { accessToken?: string } | undefined;

    if (!user || !user.accessToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const accessToken = user.accessToken;
    return res.json({ accessToken });
  }
}
