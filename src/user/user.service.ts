import { BadRequestException, Injectable } from '@nestjs/common';
import { BannedUser, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}
    async findOne(username: string): Promise<User | undefined> {
        return this.prismaService.user.findFirst({ where: { username }});
    }
    async createOne(user: Prisma.UserCreateArgs) {
        return this.prismaService.user.create(user)
    }

    async findAllUser(): Promise<User[]> {
        return this.prismaService.user.findMany()
    }
    async findAllBannedUser(): Promise<BannedUser[]> {
        return this.prismaService.bannedUser.findMany()
    }
    async banUser(userId: number) {
        return this.prismaService.bannedUser.create({
            data: {
                userId: userId,
                reason: "Ban"
            }
        })
    }
    async unbanUser(bannedUserId: number) {
        return this.prismaService.bannedUser.delete({
            where: {
                id: bannedUserId
            }
        })
    }
    async blockUser(forUserId: number, userToBlockId: number) {
        let existing = await this.prismaService.blockedUser.findFirst({where: { userId: forUserId, blockedId: userToBlockId}});
        if(existing == null) {
            throw new BadRequestException()
        }
        return this.prismaService.blockedUser.create({
            data: {
                userId: forUserId,
                blockedId: userToBlockId
            }
        })
    }
    getBlockById(blockId: number) {
        return this.prismaService.blockedUser.findFirst({where: {id: blockId}})
    }
    async unblockUser(blockId: number) {
        return this.prismaService.blockedUser.delete({
            where: {id: blockId}
        })
    }
    getBlockUsersById(forUserId: number) {
        return this.prismaService.blockedUser.findMany({where: { userId: forUserId }})
    }
}
