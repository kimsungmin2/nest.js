import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetSearchDto } from './dto/getCode.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '그룹 생성' })
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req) {
    const { userId } = req.user;

    const group = await this.groupService.createGroup(createGroupDto, userId);

    return {
      message: '그룹 생성에 성공하였습니다.',
      data: group,
    };
  }

  @UseGuards(AuthGuard('groupJwt'))
  @ApiOperation({ summary: '그룹 업데이트' })
  @Patch('update/:groupId')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('groupId') groupId: number,
  ) {
    const groupUpdate = await this.groupService.updateGroup(
      updateGroupDto,
      groupId,
    );

    return {
      message: '그룹 업데이트에 성공하였습니다.',
      data: groupUpdate,
    };
  }

  @ApiOperation({ summary: '그룹 코드 조회' })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getGroup(@Body() getSearchDto: GetSearchDto) {
    const getGroup = await this.groupService.searchGroups(getSearchDto);

    return { data: getGroup };
  }
}
