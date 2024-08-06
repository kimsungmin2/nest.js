import { Injectable, NotFoundException } from '@nestjs/common';
import { InvitationUser } from 'src/group/dto/invitationUser.dto';

@Injectable()
export class GroupUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: number, groupId: number) {
    try {
      const user = await this.prisma.groupUser.findFirst({
        where: {
          userId,
          groupId,
        },
      });
      if (!user) {
        throw new NotFoundException('존재하지 않는 가입 신청 입니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async invitationUser(invitationUser: InvitationUser, groupId: number) {
    return await this.prisma.groupUser.create({
      data: {
        ...invitationUser,
        groupId,
      },
    });
  }
}
