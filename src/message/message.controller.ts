import { MessageService } from './message.service';
import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get('/getLastMessages')
    getLastMessages() {
        return this.messageService.getLast20Messages();
    }
}
