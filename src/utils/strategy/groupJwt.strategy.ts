import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GroupJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([GroupJwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true, 
    });
  }

  private static extractJWT(req: RequestType): string | null {
    const { authorization } = req.cookies;
    if (authorization) {
      const [tokenType, token] = authorization.split(' ');
      if (tokenType !== 'Bearer')
        throw new BadRequestException('토큰 타입이 일치하지 않습니다.');
      if (token) {
        return token;
      }
    }
    return null;
  }

  async validate(req: RequestType, payload: any) {
    const user = await this.authService.findById(payload.id);

    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    const groupId = parseInt(req.params.groupId, 10);
    const manager = await this.groupService.findByGroup(groupId);

    if (!manager || manager.owner !== user.id) {
      throw new ForbiddenException('권한이 없는 유저입니다.');
    }

    return user;
  }
}
