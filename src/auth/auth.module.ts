import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AuthService],
  imports: [
    UserModule,
    PrismaModule
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
