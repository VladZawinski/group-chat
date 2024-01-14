import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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
}
