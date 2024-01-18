import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto, mapJsonToMessageDto } from './dto/message.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService
    ) {}
    async getLast20Messages(userId: number): Promise<MessageDto[]> {
        let messages = await this.prismaService.message.findMany({
            take: 20,
            orderBy: {createdAt: 'desc'},
            include: {user: true}
        });
        let hasBanned = await this.userService.isGotBanned(userId);
        if(hasBanned) {
            throw new ForbiddenException()
        }
        let blockedUsers = await this.userService.getBlockUsersById(userId);
        let bannedUsers = await this.userService.findAllBannedUser();
        let filteredMessages = messages.filter((message) => {
            const isNotBlocked = !blockedUsers.some(
              (blockedUser) => blockedUser.blocked.id === message.user.id
            );
          
            return isNotBlocked;
          });
          
        return filteredMessages.map(e => mapJsonToMessageDto(e));
    }
    async create(userId: number, body: string) {
        return this.prismaService.message.create({
            data: {
                content: body,
                userId: userId
            }
        })
    }
}
