import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { FcmModule } from 'src/fcm/fcm.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [
    PrismaModule,
    FcmModule
  ],
  controllers: [UserController]
})
export class UserModule {}
