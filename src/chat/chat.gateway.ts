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
    private onlineUsers = [];
    private logger: Logger = new Logger('Chat-Gateway');
    handleDisconnect(client: any) {
        this.logger.log('Disconnected');
        this.removeOnlineUser(client)
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
            let hasBanned = await this.userService.isGotBanned(user.id);
            if(hasBanned) {
                return client.disconnect()
            }
            client.userId = user.id;
            client.username = user.username;
            if(user.username != 'guest@mailinator.com') {
                this.addOnlineUser(client.userId);
                this.emitOnlineUsers();
            }
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
    private addOnlineUser(userId: string) {
        if (!this.onlineUsers.includes(userId)) {
            this.onlineUsers.push(userId);
        }
    }

    private emitOnlineUsers() {
        this.server.emit(ON_ONLINE_USERS_CHANGED, this.onlineUsers.length);
    }

    private removeOnlineUser(client: any) {
        if(client.username != 'guest@mailinator.com') {
            const index = this.onlineUsers.indexOf(client.userId);
            if (index !== -1) {
                this.onlineUsers.splice(index, 1);
            }
            this.emitOnlineUsers();
        }
    }

}

const ON_NEW_MESSAGE_ADDED_EVENT = "onNewMessageAdded"
const ON_CONVERSATION_CHANGED_EVENT = "onConversationChanged"
const ON_ONLINE_USERS_CHANGED = "onOnlineUsersChanged"
