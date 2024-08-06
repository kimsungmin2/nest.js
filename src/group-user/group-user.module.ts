import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { GroupUserController } from './group-user.controller';

@Module({
  controllers: [GroupUserController],
  providers: [GroupUserService],
})
export class GroupUserModule {}
