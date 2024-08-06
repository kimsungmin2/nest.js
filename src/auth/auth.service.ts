import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { jwtData } from '../utils/data/jwt.data';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { UpDateNameDto } from './dto/request/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async createToken(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.findByEmail(email);

      const payload = { sub: user.id };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: jwtData.accessToken,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn: jwtData.refreshToken,
      });

      await this.authRepository.updateToken(refreshToken, user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(
        '토큰 생성중 중 오류가 발생했습니다.',
      );
    }
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
      throw new InternalServerErrorException(
        '유저 생성 중 오류가 발생했습니다.',
      );
    }
  }

  public async findByEmail(email: string) {
    try {
      return await this.authRepository.findByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        '이메일 조회 중 오류가 발생했습니다.',
      );
    }
  }

  public async findById(id: string) {
    try {
      return await this.authRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        '아이디 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async updateName(updateNameDto: UpDateNameDto, id: string) {
    try {
      const { name } = updateNameDto;
      return await this.authRepository.updateName(name, id);
    } catch (error) {
      throw new InternalServerErrorException(
        '이름 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async deleteName(id: string) {
    try {
      return await this.authRepository.deleteUser(id);
    } catch (error) {
      throw new InternalServerErrorException(
        '유저 삭제 중 오류가 발생했습니다.',
      );
    }
  }
}
