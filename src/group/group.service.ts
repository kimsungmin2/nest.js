import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GroupService {
  constructor(private readonly authService: AuthService) {}

  async createGroup(createGroupDto: CreateGroupDto, email: string) {
    const isEixtsingUser = await this.authService.findByEmail(email);
    if (!isEixtsingUser) {
      throw new NotFoundException('존재하지 않는 아이디 입니다.');
    }
    return this.prisma.group.create(...createGroupDto);
  }
}
