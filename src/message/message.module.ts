import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageController } from './message.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [
    PrismaModule,
    UserModule
  ],
  controllers: [MessageController]
})
export class MessageModule {}
