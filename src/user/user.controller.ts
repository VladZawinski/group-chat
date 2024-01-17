import { BadRequestException, Controller, ForbiddenException, Get, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { EmailAuthKeyGuard } from 'src/guards/email-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
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
    async unblockUser(@Request() request,@Query('blockId') blockId: string) {
        let userid = request.userId;
        let block = await this.userService.getBlockById(+blockId);
        if(block == null) {
            throw new BadRequestException("")
        }
        if(block.userId != userid){
            throw new ForbiddenException()
        }
        return this.userService.unblockUser(+blockId)
    }
}
