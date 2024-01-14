import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private readonly prismaService: PrismaService) {}
    getLast20Messages() {
        return this.prismaService.message.findMany({take: 20, orderBy: {createdAt: 'desc'}})
    }
    create(userId: string, body: string) {
        return this.prismaService.message.create({
            data: {
                userId: userId,
                content: body
            }
        })
    }
}
