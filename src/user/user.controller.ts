import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { EmailAuthKeyGuard } from 'src/guards/email-auth.guard';
import { AddKeywordDto } from './dto/add-keyword.dto';
import { RegisterFirebaseTokenDto } from './dto/user-firebase.dto';
import { CreateReportDto } from './dto/report.dto';
import { FcmService } from 'src/fcm/fcm.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly fcmService: FcmService
    ) {}
    @Get('/')
    findAllUser() {
        return this.userService.findAllUser()
    }
    @Get('/bannedUsers')
    bannedUser() {
        return this.userService.findAllBannedUser()
    }
    
    @UseGuards(ApiKeyGuard)
    @Get('/keywords')
    getAllKeywords() {
        return this.userService.findBanKeywords()
    }
    @UseGuards(ApiKeyGuard)
    @Post('/addKeyword/')
    addKeyword(@Body() dto: AddKeywordDto) {
        return this.userService.addBanKeyword(dto.body);
    }
    @UseGuards(ApiKeyGuard)
    @Delete('/deleteKeyword/:id')
    deleteKeyword(@Param('id') id: string) {
        return this.userService.deleteBankeywords(+id)
    }
    @UseGuards(ApiKeyGuard)
    @Post('/banUser/:userId')
    banUser(@Param('userId') userId: string) {
        return this.userService.banUser(+userId)
    }
    @UseGuards(ApiKeyGuard)
    @Post('/unbanUser/:userId')
    unbanUser(@Param('userId') userId: string) {
        return this.userService.unbanUser(+userId)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Get('/blockedUsers')
    getBlockedUsers(@Request() request) {
        let userid = request.userId;
        return this.userService.getBlockUsersById(+userid)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/block')
    blockUser(@Request() request, @Query('blockUserId') blockUserId: string) {
        let userid = request.userId;
        return this.userService.blockUser(+userid, +blockUserId)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/unblock')
    async unblockUser(@Request() request, @Query('blockId') blockId: string) {
        let userid = request.userId;
        let block = await this.userService.getBlockById(+blockId);
        if(block == null) {
            throw new BadRequestException("")
        }
        if(block.userId != userid) {
            throw new ForbiddenException()
        }
        return this.userService.unblockUser(+blockId)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Get('/subscribers')
    async getSubscribers(@Request() request) {
        let userid = request.userId;
        return this.userService.getUserFollowing(userid);
    }
    @UseGuards(EmailAuthKeyGuard)
    @Get('/getFollowers')
    async getFollowers(@Request() request) {
        let userid = request.userId;
        return this.userService.getSubscribersOfUser(userid);
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/subscribe')
    async subscribeNotification(@Request() request, @Query('userId') toUserId: string) {
        let userid = request.userId;
        return this.userService.subscribeNotification(userid, +toUserId);
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/unsubscribe')
    async unsubscribeNotification(@Request() request, @Query('subscriberId') subscribeId: string) {
        let userid = request.userId;
        let existing = await this.userService.getSubscribe(+subscribeId, +userid)
        return this.userService.unsubscribeNotification(existing.id)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/unsubscribeAll')
    async unsubscribeAll(@Request() request) {
        let userid = request.userId;
        return this.userService.unsubscribedAllFollowing(userid)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/registerFirebaseToken')
    async registerFirebaseToken(@Request() request) {
        let userid = request.userId;
        let dto: RegisterFirebaseTokenDto = request.body;
        return this.userService.registerFcmToken(userid, dto.token)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/logout')
    async logout(@Request() request) {
        let userid = request.userId;
        return this.userService.logout(userid)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('/report')
    async report(@Request() request) {
        let userid = request.userId;
        let body: CreateReportDto = request.body;
        return this.userService.createReport(body.messageId, body.reason, userid)
        
    }
    @Get('/getLast10Reports')
    async getLast10Reports() {
        return this.userService.getLast10Reports()
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('checkAlreadyReport')
    async hasAlreadyReport(@Request() request, @Query('messageId') messageId: string) {
        let userid = request.userId;
        return this.userService.hasAlreadyReport(+messageId, userid)
    }
    @UseGuards(EmailAuthKeyGuard)
    @Post('testNotiToken')
    async testNoti(@Request() request) {
        let userid = request.userId;
        let user = await this.userService.findById(+userid)
        await this.fcmService.sendToToken(user.fcmToken, 'Test Noti with token');
    }
}
