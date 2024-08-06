import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InvitationUser } from 'src/group/dto/invitationUser.dto';
import { GroupUserRepository } from './group-user.repository';

@Injectable()
export class GroupUserService {
  constructor(private readonly groupUserRepository: GroupUserRepository) {}
  async invitationUser(invitationUser: InvitationUser, groupId: number) {
    try {
      return await this.groupUserRepository.invitationUser(
        invitationUser,
        groupId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        '가입 승인 중 오류가 발생했습니다.',
      );
    }
  }

  async findByUser(userId: number, groupId: number) {
    try {
      return await this.groupUserRepository.findByUser(userId, groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '가입 신청 유저 조회 중 오류가 발생했습니다.',
      );
    }
  }
}
