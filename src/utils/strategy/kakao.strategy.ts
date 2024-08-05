import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    try {
      const email = profile._json && profile._json.kakao_account.email;
      const nickName = profile.displayName;
      const provider = profile.provider;

      let user = await this.authService.findByEmail(email);

      if (!user) {
        user = await this.authService.createProviderUser(
          email,
          nickName,
          provider,
        );
      }

      const { accessToken } = await this.authService.createToken(email);

      done(null, { accessToken });
    } catch (error) {
      console.error('인증 처리 중 오류 발생:', error);
      done(error, false);
    }
  }
}