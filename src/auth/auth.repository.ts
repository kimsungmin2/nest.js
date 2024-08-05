import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, nickName: string, provider: string) {
    return this.prisma.users.create({
      data: {
        email,
        nickName,
        provider,
      },
    });
  }

  async findByEmail(email: string) {
    try {
      const isExistingEmail = await this.prisma.users.findFirst({
        where: {
          email,
        },
        select: {
          email: true,
          nickName: true,
        },
      });

      if (!isExistingEmail) {
        throw new NotFoundException('존재하지 않는 이메일 입니다.');
      }

      return isExistingEmail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async findById(id: string) {
    try {
      const isExistingId = await this.prisma.users.findFirst({
        where: {
          id,
        },
        select: {
          email: true,
          nickName: true,
        },
      });

      if (!isExistingId) {
        throw new NotFoundException('존재하지 않는 아이디 입니다.');
      }

      return isExistingId;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
}
