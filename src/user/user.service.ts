import { BadRequestException, Injectable } from '@nestjs/common';
import { BannedUser, BlockedUser, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BanUserDto, mapBanUser } from './dto/ban-user.dto';
import { BlockedUserDto, mapBlockUser } from './dto/block-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}
    async findOne(username: string): Promise<User | undefined> {
        return this.prismaService.user.findFirst({ where: { username }});
    }
    async createOne(user: Prisma.UserCreateArgs){
        return this.prismaService.user.create(user)
    }

    async findAllUser(): Promise<User[]> {
        return this.prismaService.user.findMany()
    }
    async isGotBanned(userId: number): Promise<boolean> {
        let banned = await this.prismaService.bannedUser.count({where: { userId }})
        return banned != 0
    }
    async findAllBannedUser(): Promise<BanUserDto[]> {
        let bannedUsers = await this.prismaService.bannedUser.findMany({
            include: {
                user: true
            }
        })
        return bannedUsers.map(e => mapBanUser(e));
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
        if(existing != null) {
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
    async getBlockUsersById(forUserId: number): Promise<BlockedUserDto[]> {
        let blocked = await this.prismaService.blockedUser.findMany({where: { userId: forUserId }, include: {blocked: true}});
        return blocked.map(e => mapBlockUser(e))
    }
    addBanKeyword(keyword: string) {
        return this.prismaService.banKeyword.create({data: { body: keyword }});
    }
    findBanKeywords() {
        return this.prismaService.banKeyword.findMany({});
    }
    deleteBankeywords(id: number) {
        return this.prismaService.banKeyword.delete({where: { id }});
    }
    async subscribeNotification(forUserId: number, toUserId: number) {
        let subscriber = await this.prismaService.user.findFirst({where: { id: toUserId }, include: { subscribers: true}});
        let subscriberIds = subscriber.subscribers.map(e => e.followerId)
        if(subscriberIds.includes(forUserId)) {
            throw new BadRequestException("Already Subscribed!");
        }
        return this.prismaService.subscribe.create({
            data: {
                followerId: forUserId,
                followsId: toUserId
            }
        });
    }
    getSubscribe(followsId: number, followerId: number) {
        return this.prismaService.subscribe.findFirst({where: { followerId, followsId }})
    }
    async getUserFollowing(userId: number) {
        const follows = await this.prismaService.subscribe.findMany({
            where: {
                followerId: userId,
            },
            select: {
                follows: true,
            },
        });
        const followsIds = follows.map((follow) => follow.follows);
        return followsIds;
    }
    async getFollowingUserIds(userId: number) {
        const follows = await this.prismaService.subscribe.findMany({
            where: {
                followerId: userId,
            },
            select: {
                follows: true,
            },
        });
        const followsIds = follows.map((follow) => follow.follows);
        return followsIds.map(e => e.id);
    }
    getSubscribersOfUser(userId: number) {
        return this.prismaService.user.findFirst({where: { id: userId}, include: { subscribers: { include: { follower: true}}}})
    }
    unsubscribeNotification(subscribeId: number) {
        return this.prismaService.subscribe.delete({where: { id: subscribeId }});
    }
    registerFcmToken(userId: number, token: string) {
        return this.prismaService.user.update({where: { id: userId}, data: { fcmToken: token }})
    }
    logout(userId: number) {
        return this.prismaService.user.update({where: { id: userId}, data: { fcmToken: null }})
    }
}
