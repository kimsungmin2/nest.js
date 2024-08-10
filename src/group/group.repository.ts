import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/request/createGroup.dto';

@Injectable()
export class GroupRepository {
  constructor(private prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto, userId: number) {
    return await this.prisma.group.create({
      data: {
        owner: userId,
        ...createGroupDto,
      },
    });
  }

  async updateGroup(comment: string, name: string, groupId: number) {
    return await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
        comment,
      },
    });
  }

  async findByGroup(groupId: number) {
    try {
      const group = await this.prisma.group.findFirst({
        where: {
          id: groupId,
        },
      });

      if (!group) {
        throw new NotFoundException('존재하지 않는 그룹 입니다.');
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

  async searchGroups(search: string) {
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
    return await this.prisma.group.update({
      where: {
        id,
      },
      data: {
        code,
      },
    });
  }
}
