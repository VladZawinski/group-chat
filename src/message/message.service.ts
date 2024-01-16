import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto, mapJsonToMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
    constructor(private readonly prismaService: PrismaService) {}
    async getLast20Messages(): Promise<MessageDto[]> {
        let messages = await this.prismaService.message.findMany({
            take: 20,
            orderBy: {createdAt: 'desc'},
            include: {user: true}
        });
        return messages.map(e => mapJsonToMessageDto(e));
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
