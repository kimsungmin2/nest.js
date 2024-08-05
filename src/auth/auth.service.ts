import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { jwtData } from '../utils/data/jwt.data';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

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
      return await this.prisma.$transaction(async (tx) => {
        const isExistingUser = await this.findByEmail(email);
        if (isExistingUser) {
          throw new ConflictException('존재하는 이메일 입니다.');
        }

        const user = await tx.user.create({
          data: {
            email,
            nickName,
            provider,
          },
        });

        return user;
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  private async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        nickName: true,
      },
    });
  }
}
