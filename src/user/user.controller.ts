import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { EmailAuthKeyGuard } from 'src/guards/email-auth.guard';
import { AddKeywordDto } from './dto/add-keyword.dto';

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
