import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { FcmModule } from './fcm/fcm.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ChatModule, UserModule, MessageModule, PrismaModule, AuthModule, FcmModule, NotificationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
