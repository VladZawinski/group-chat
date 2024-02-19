import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { User } from "@prisma/client";
import { Socket } from 'socket.io';
import { AuthService } from "src/auth/auth.service";
import { FcmService } from "src/fcm/fcm.service";
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
        private readonly messageService: MessageService,
        private readonly fcmService: FcmService
    ) {
        this.logger.log("Chat Gateway")
    }
    private onlineUsers: User[] = [];
    private banKeywords = [];
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
            // let hasBanned = await this.userService.isGotBanned(user.id);
            // if(hasBanned) {
            //     return client.disconnect()
            // }
            client.userId = user.id;
            client.username = user.username;
            if(user.username != 'guest@mailinator.com') {
                console.log(user);
                this.addOnlineUser(user);
                this.emitOnlineUsers();
            }
        }
    }
    async afterInit(server: any) {
        this.logger.log("Connected")
        // await this.fcmService.sendToToken("ed8L_okRQW2Btr66KXAwnd:APA91bHHWzAxJXZW4gN1XsuYyJvrsW1bx_lpRTsJG84zZTMgrvyUCA5QsEd7SvcaNTBVVExu8_g5uIR0aFaycXXdA4pgIVBX5j6pdVCeGfdTT8RAhRvmPrQn0acSN7bABB1RZpIfDVRT", "Hello")
    }
    @SubscribeMessage('sendMessage')
    async handlSendMessage(client: any, data: any) {
        let userId = client.userId
        let hasBanned = await this.userService.isGotBanned(userId);
        if(!hasBanned) {
            let sentMessage = await this.messageService.create(userId, data.message)
            this.server.emit(ON_NEW_MESSAGE_ADDED_EVENT, sentMessage)
            let sender = await this.userService.findById(userId)
            const msgBody = `${sender.name}: ${data.message}`
            await this.notifyToSubscribers(userId, msgBody);
        }
    }

    private async notifyToSubscribers(userId: number, body: string) {
        let sender = await this.userService.getSubscribersOfUser(userId);
        let subscribers = sender;
        for (let i = 0; i < subscribers.length; i++) {
            const element = subscribers[i];
            let fcmToken = element.follower.fcmToken;
            console.log(`Fcm Token: ${fcmToken}`);
            
            if(fcmToken != null) {
                await this.fcmService.sendToToken(fcmToken, body)
            }
        }
    }

    private addOnlineUser(user: User) {
        let existing = this.onlineUsers.find(e => e.id == user.id)
        if (existing == null) {
            this.onlineUsers.push(user);
        }
    }
    filterText(text: string, banKeywords: string[]): boolean {
        return !banKeywords.some(keyword => text.includes(keyword));
    }
    
    private emitOnlineUsers() {
        let payload = {
            count: this.onlineUsers.length,
            members: this.onlineUsers
        }
        this.server.emit(ON_ONLINE_USERS_CHANGED, payload);
    }

    private removeOnlineUser(client: any) {
        if(client.username != 'guest@mailinator.com') {
            const index = this.onlineUsers.findIndex(e => e.id == client.userId)
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
