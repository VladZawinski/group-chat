import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageController } from './message.controller';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [PrismaModule],
  controllers: [MessageController]
})
export class MessageModule {}
