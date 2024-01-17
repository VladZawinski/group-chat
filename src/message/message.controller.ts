import { EmailAuthKeyGuard } from 'src/guards/email-auth.guard';
import { MessageService } from './message.service';
import { Controller, Get, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';

@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService
    ) {}

    @UseGuards(EmailAuthKeyGuard)
    @Get('/getLastMessages')
    getLastMessages(@Request() request) {
        let userId = request.userId;
        return this.messageService.getLast20Messages(userId);
    }
}
