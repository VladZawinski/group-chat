import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BroadcastWithTopicDto } from './dto/broadcast.dto';
import { FcmService } from 'src/fcm/fcm.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller('notification')
export class NotificationController {
    constructor(private readonly fcmService: FcmService) {}
    @UseGuards(ApiKeyGuard)
    @Post('broadcast')
    broadcastNotificationWithTopic(@Body() body: BroadcastWithTopicDto) {
        return this.fcmService.sendNotificationWithTopic("broadcast-main", body.title, body.body);
    }
    @Get('test')
    testNoti() {
        return this.fcmService.sendNotificationWithTopic("broadcast-main", 'Testing Title', 'Testing Body');
    }
}
