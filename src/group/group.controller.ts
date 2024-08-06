import {
  Body,
  Controller,
  Delete,
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
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetSearchDto } from './dto/getCode.dto';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '그룹 생성' })
  @ApiCookieAuth('accessToken')
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, type: CreateGroupDto })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req) {
    const { userId } = req.user;

    const createGroup = await this.groupService.createGroup(
      createGroupDto,
      userId,
    );

    return {
      message: '그룹 생성에 성공하였습니다.',
      data: createGroup,
    };
  }

  @UseGuards(AuthGuard('groupJwt'))
  @ApiOperation({ summary: '그룹 업데이트' })
  @ApiCookieAuth('accessToken')
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ status: 201, type: UpdateGroupDto })
  @ApiParam({ name: 'groupId', type: Number, description: '그룹 ID' })
  @Patch('update/:groupId')
  @HttpCode(HttpStatus.CREATED)
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('groupId') groupId: number,
  ) {
    const updateGroup = await this.groupService.updateGroup(
      updateGroupDto,
      groupId,
    );

    return {
      message: '그룹 업데이트에 성공하였습니다.',
      data: updateGroup,
    };
  }

  @ApiOperation({ summary: '그룹 조회' })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: GetSearchDto })
  @ApiBody({ type: GetSearchDto })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getGroup(@Body() getSearchDto: GetSearchDto) {
    const getGroup = await this.groupService.searchGroups(getSearchDto);

    return {
      data: getGroup,
    };
  }

  @ApiOperation({ summary: '그룹 삭제' })
  @UseGuards(AuthGuard('groupJwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'groupId', type: Number, description: '그룹 ID' })
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  async deleteGroup(@Param('groupId') groupId: number) {
    const deleteGroup = await this.groupService.deleteGroup(groupId);

    return {
      message: '그룹이 정상적으로 해체되었습니다.',
      data: deleteGroup,
    };
  }
}
