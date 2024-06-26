import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from 'src/auth/auth.module';
import { FcmModule } from 'src/fcm/fcm.module';

@Module({
    providers: [ChatGateway],
    imports: [
        UserModule,
        MessageModule,
        AuthModule,
        FcmModule
    ]
})
export class ChatModule {}
