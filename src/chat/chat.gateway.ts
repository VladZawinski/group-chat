import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    cors: {
      origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
    constructor(
        private readonly authService: AuthService
    ) {
        this.logger.log("Chat Gateway")
    }
    private logger: Logger = new Logger('Chat-Gateway');
    handleDisconnect(client: any) {
        this.logger.log('Disconnected');
    }
    @WebSocketServer()
    server: Socket;
    handleConnection(client: any, ...args: any[]) {
        this.logger.log(client)
        const token = client.handshake.query.token;
        client.token = token;
        let encrypted = this.authService.encrypt('TOKEN');
        console.log(`Encrypted ${encrypted}`);
        let decr = this.authService.decrypt(encrypted);
        console.log(`Decrypted ${decr}`);
        
    }
    afterInit(server: any) {
        this.logger.log("Connected")
        server.emit("onChanged", {})
    }
    @SubscribeMessage('sendMessage')
    handlSendMessage(client: any, data: string) {
    
        this.server.emit(ON_NEW_MESSAGE_ADDED_EVENT, {})
        this.server.emit(ON_CONVERSATION_CHANGED_EVENT, {})
    }

}

const ON_NEW_MESSAGE_ADDED_EVENT = "onNewMessageAdded"
const ON_CONVERSATION_CHANGED_EVENT = "onConversationChanged"
