import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { GroupModule } from './group/group.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, AwsModule, GroupModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
