import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupOption } from 'src/utils/data/group.data';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InvitationUser } from './dto/invitationUser.dto';

@Injectable()
export class GroupRepository {
  constructor(private prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto, id: string) {
    return await this.prisma.group.create({
      data: {
        id,
        ...createGroupDto,
      },
    });
  }

  async updateGroup(updateGroupDto: UpdateGroupDto, id: number) {
    return await this.prisma.group.update({
      where: {
        id,
      },
      data: {
        ...updateGroupDto,
      },
    });
  }

  async findByGroup(groupId: number, option?: number) {
    try {
      const group = await this.prisma.group.findFirst({
        where: {
          id: groupId,
        },
      });

      if (!group) {
        throw new NotFoundException('존재하지 않는 그룹 입니다.');
      }

      if (option && option === GroupOption.usergroup) {
        const groupUsers = await this.prisma.groupUsers.findMany({
          where: {
            groupId,
          },
          include: {
            users: true,
          },
        });

        return { group, groupUsers };
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async deleteGroup(groupId: number) {
    return await this.prisma.group.delete({
      where: {
        id: groupId,
      },
    });
  }

  async getCodeGroup(code: string) {
    try {
      const group = await this.prisma.group.findFirst({
        where: {
          code,
        },
      });

      if (!group) {
        throw new NotFoundException('존재하지 않는 코드 입니다.');
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async searchgroup(search: string) {
    try {
      const group = await this.prisma.group.findMany({
        where: {
          name: {
            startsWith: search,
          },
        },
      });

      if (group.length === 0) {
        throw new NotFoundException('검색한 그룹이 존재하지 않습니다.');
      }

      return group;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async updateCode(id: number, code: string) {
    return await this.prisma.group.upadte({
      where: {
        id,
      },
      data: {
        code,
      },
    });
  }
}
