import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './group.repository';
import { v4 as uuidv4 } from 'uuid';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetSearchDto } from './dto/getCode.dto';
import { InvitationUser } from './dto/invitationUser.dto';
import { iif } from 'rxjs';
import { GroupUserService } from 'src/group-user/group-user.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupUserService: GroupUserService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, groupId: string) {
    try {
      return await this.groupRepository.createGroup(createGroupDto, groupId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '그룹 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async updateCode(groupId: number) {
    try {
      await this.getGroup(groupId);
      const code = uuidv4();
      return await this.groupRepository.updateCode(groupId, code);
    } catch (error) {
      throw new InternalServerErrorException(
        '코드 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async updateGroup(updateGroupDto: UpdateGroupDto, groupId: number) {
    try {
      await this.getGroup(groupId);
      return await this.groupRepository.updateGroup(updateGroupDto, groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async getGroup(groupId: number, option?: number) {
    try {
      return await this.groupRepository.findByGroup(groupId, option);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹을 찾는 중에 오류가 발생했습니다.',
      );
    }
  }

  async deleteGroup(groupId: number) {
    try {
      await this.getGroup(groupId);
      return await this.groupRepository.deleteGroup(groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 삭제 중 오류가 발생했습니다.',
      );
    }
  }

  async searchGroups(getSearchDto: GetSearchDto) {
    try {
      if (getSearchDto && getSearchDto.code) {
        return await this.groupRepository.getCodeGroup(getSearchDto.code);
      } else if (getSearchDto && getSearchDto.search) {
        return await this.groupRepository.searchGroups(getSearchDto.search);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async invitationUser(invitationUser: InvitationUser, groupId: number) {
    try {
      await this.groupUserService.findByUser(invitationUser.userId, groupId);

      return await this.groupUserService.invitationUser(
        invitationUser,
        groupId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 가입 승인 중 오류가 발생했습니다.',
      );
    }
  }
}
