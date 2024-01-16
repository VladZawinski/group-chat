import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [ChatModule, UserModule, MessageModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
