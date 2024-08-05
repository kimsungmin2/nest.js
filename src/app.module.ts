import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [AuthModule, AwsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
