import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { jwtData } from '../utils/data/jwt.data';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async createToken(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findByEmail(email);

    const refreshTokenCacheKey = `loginId:${user.id}`;
    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_SECRET_KEY),
      expiresIn: jwtData.accessToken,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(REFRESH_SECRET),
      expiresIn: jwtData.refreshToken,
    });

    try {
      await this.redisService
        .getCluster()
        .set(refreshTokenCacheKey, refreshToken, 'EX', jwtData.refreshToken);
    } catch (error) {
      throw new InternalServerErrorException(
        '리프레시 토큰 저장 중 오류가 발생했습니다.',
      );
    }

    return { accessToken, refreshToken };
  }

  async createProviderUser(
    email: string,
    nickName: string,
    provider: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const isExistingUser = await this.findByEmail(email);
      if (isExistingUser) {
        throw new ConflictException('존재하는 이메일 입니다.');
      }

      const user = await this.authRepository.createUser(
        email,
        nickName,
        provider,
      );

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
    }
  }

  private async findByEmail(email: string) {
    try {
      return await this.authRepository.findByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        '이메일을 찾는 중에 오류가 발생했습니다.',
      );
    }
  }

  public async findById(id: string) {
    try {
      return await this.authRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        '아이디를 찾는 중에 오류가 발생했습니다.',
      );
    }
  }
}
