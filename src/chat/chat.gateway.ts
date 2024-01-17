import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { AuthService } from "src/auth/auth.service";
import { MessageService } from "src/message/message.service";
import { UserService } from "src/user/user.service";

@WebSocketGateway({
    cors: {
      origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly messageService: MessageService
    ) {
        this.logger.log("Chat Gateway")
    }
    private logger: Logger = new Logger('Chat-Gateway');
    handleDisconnect(client: any) {
        this.logger.log('Disconnected');
    }
    @WebSocketServer()
    server: Socket;
    async handleConnection(client: any, ...args: any[]) {
        const token = client.handshake.query.token;
        if(token != null) {
            client.token = token;
            let decrypted = this.authService.decrypt(token);
            let user = await this.userService.findOne(decrypted);
            if(user == null) {
                return client.disconnect()
            }
            client.userId = user.id;
        }
    }
    afterInit(server: any) {
        this.logger.log("Connected")
        server.emit("onChanged", {})
    }
    @SubscribeMessage('sendMessage')
    async handlSendMessage(client: any, data: any) {
        let userId = client.userId
        let sentMessage = await this.messageService.create(userId, data.message)
        this.server.emit(ON_NEW_MESSAGE_ADDED_EVENT, sentMessage)
    }

}

const ON_NEW_MESSAGE_ADDED_EVENT = "onNewMessageAdded"
const ON_CONVERSATION_CHANGED_EVENT = "onConversationChanged"
