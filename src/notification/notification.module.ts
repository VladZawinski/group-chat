import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FcmModule } from 'src/fcm/fcm.module';
import { NotificationController } from './notification.controller';

@Module({
  providers: [
    NotificationService
  ],
  imports: [
    FcmModule
  ],
  controllers: [NotificationController]
})
export class NotificationModule {}
