import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { v4 as uuidv4 } from 'uuid';
import { CreateGroupDto } from './dto/request/createGroup.dto';
import { UpdateGroupDto } from './dto/request/updateGroup.dto';
import { GetCodeDto } from './dto/request/getCode.dto';
import { GetSearchDto } from './dto/request/getSearch.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(createGroupDto: CreateGroupDto, userId: number) {
    try {
      return await this.groupRepository.createGroup(createGroupDto, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '그룹 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async updateCode(groupId: number, userId: number) {
    try {
      await this.checkOwner(groupId, userId);
      await this.getGroup(groupId);
      const code = uuidv4();
      return await this.groupRepository.updateCode(groupId, code);
    } catch (error) {
      throw new InternalServerErrorException(
        '코드 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async updateGroup(updateGroupDto: UpdateGroupDto, userId: number) {
    try {
      const { groupId, comment, name } = updateGroupDto;
      await this.checkOwner(groupId, userId);
      await this.getGroup(groupId);
      return await this.groupRepository.updateGroup(comment, name, groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async getGroup(groupId: number) {
    try {
      return await this.groupRepository.findByGroup(groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹을 찾는 중에 오류가 발생했습니다.',
      );
    }
  }

  async deleteGroup(groupId: number, userId: number) {
    try {
      await this.checkOwner(groupId, userId);
      await this.getGroup(groupId);
      return await this.groupRepository.deleteGroup(groupId);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 삭제 중 오류가 발생했습니다.',
      );
    }
  }

  async getCodeGroup(getCodeDto: GetCodeDto) {
    try {
      return await this.groupRepository.getCodeGroup(getCodeDto.code);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async searchGroups(getSearchDto: GetSearchDto) {
    try {
      return await this.groupRepository.searchGroups(getSearchDto.search);
    } catch (error) {
      throw new InternalServerErrorException(
        '그룹 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async checkOwner(groupid: number, userId: number) {
    try {
      const owner = await this.getGroup(groupid);

      if (owner?.owner !== userId) {
        throw new ForbiddenException('권한이 없습니다.');
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
    }
  }
}
