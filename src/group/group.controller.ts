import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/request/createGroup.dto';
import { JwtRequest } from 'src/utils/data/jwt.data';
import { UpdateGroupDto } from './dto/request/updateGroup.dto';
import { GetGroupDto } from './dto/request/getGroup';
import { GetCodeDto } from './dto/request/getCode.dto';
import { GetSearchDto } from './dto/request/getSearch.dto';
import { CreateGroupResponseDto } from './dto/response/createGroup.dto';
import { GetGroupsDto } from './dto/response/getGroups.dto';
import { UpadteGroupResponseDto } from './dto/response/updateGroupResponse.dto';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * userFlow => 그룹 생성 요청 => 그룹 생성 성공
   * serverFlow => 생성 생성 생성
   * 3계층 순서로 생성 요청을 보냄
   * Controller(createGroup)
   * Service(createGroup)
   * Repository(createGroup)
   * RequsetDto(CreateGroupDto)
   * ResponseDto(CreateGroupResponseDto)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '그룹 생성' })
  @ApiCookieAuth('accessToken')
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, type: CreateGroupResponseDto })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: JwtRequest,
  ) {
    const { userId } = req.user;

    return await this.groupService.createGroup(createGroupDto, userId);
  }

  /**
   * userFlow => 그룹 이름, 코멘트 업데이트 요청 => 그룹 업데이트 성공
   * serverFlow => 오너인지 확인 후 오너가 맞다면 => 업데이트
   * 3계층 순서로 요청을 보냄
   * Controller(updateGroup)
   * Service(updateGroup,getGroup,checkOwner)
   * Repository(updateGroup)
   * RequsetDto(UpdateGroupDto)
   * ResponseDto(UpdateGroupDto)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '그룹 업데이트' })
  @ApiCookieAuth('accessToken')
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ status: 201, type: UpadteGroupResponseDto })
  @Patch('update')
  @HttpCode(HttpStatus.CREATED)
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() req: JwtRequest,
  ) {
    const { userId } = req.user;
    return await this.groupService.updateGroup(updateGroupDto, userId);
  }

  /**
   * userFlow => 그룹 코드 업데이트 요청 => 그룹 코드 업데이트 성공
   * serverFlow => 오너인지 확인 후 오너가 맞다면 => 업데이트
   * 3계층 순서로 요청을 보냄
   * Controller(updateCode)
   * Service(updateCode,getGroup,checkOwner)
   * Repository(updateCode)
   * RequsetDto(GetGroupDto)
   * ResponseDto(UpdateGroupDto)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '그룹 코드 변경' })
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 201, type: UpadteGroupResponseDto })
  @ApiParam({ name: 'groupId', type: Number, description: '그룹 ID' })
  @Patch('update/code')
  @HttpCode(HttpStatus.CREATED)
  async updateCode(@Body() GetGroupDto: GetGroupDto, @Req() req: JwtRequest) {
    const { userId } = req.user;

    return await this.groupService.updateCode(GetGroupDto.groupId, userId);
  }

  /**
   * userFlow => 그룹 이름으로 검색 => 검색 성공 // 대충 구현해놓았는데 안쓸듯?
   * 3계층 순서로 요청을 보냄
   * Controller(getGroup)
   * Service(searchGroups)
   * Repository(searchGroups)
   * RequsetDto(GetGroupDto)
   * ResponseDto(GetGroupsDto)
   */
  @ApiOperation({ summary: '그룹 이름 검색' })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: GetGroupsDto })
  @ApiBody({ type: GetSearchDto })
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async getGroup(@Body() getSearchDto: GetSearchDto) {
    return await this.groupService.searchGroups(getSearchDto);
  }

  /**
   * userFlow => 그룹 코드로 검색 =>  성공
   * 3계층 순서로 요청을 보냄
   * Controller(getCodeGroup)
   * Service(getCodeGroup)
   * Repository(getCodeGroup)
   * RequsetDto(GetCodeDto)
   * ResponseDto(GetGroupsDto)
   */
  @ApiOperation({ summary: '그룹 코드 검색' })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: GetGroupsDto })
  @ApiBody({ type: GetCodeDto })
  @Get('code')
  @HttpCode(HttpStatus.OK)
  async getCodeGroup(@Body() getCodeDto: GetCodeDto) {
    return await this.groupService.getCodeGroup(getCodeDto);
  }

  /**
   * userFlow => 그룹 삭제 =>  성공
   * serverFlow => 오너인지 확인 후 오너가 맞다면 => 삭제
   * 3계층 순서로 요청을 보냄
   * Controller(deleteGroup)
   * Service(deleteGroup,getGroup,checkOwner)
   * Repository(deleteGroup)
   * RequsetDto(GetGroupDto)
   * ResponseDto()
   */
  @ApiOperation({ summary: '그룹 삭제' })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 204 })
  @ApiBody({ type: GetGroupDto })
  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Body() getGroupDto: GetGroupDto, @Req() req: JwtRequest) {
    const { userId } = req.user;
    return await this.groupService.deleteGroup(getGroupDto.groupId, userId);
  }
}
