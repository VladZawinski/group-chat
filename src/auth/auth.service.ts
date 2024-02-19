import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Role } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly prismaService: PrismaService,
    ) {}
    
    async generateToken(email: string, name: string): Promise<string> {
        const existing = await this.userService.findOne(email);
        if(existing != null) {
            return this.encrypt(existing.username)
        } else {
            throw new UnauthorizedException()
        }
    }
    async signIn(dto: SignInDto): Promise<string> {
        const existing = await this.userService.findOne(dto.email);
        if(existing != null) {
            await this.prismaService.user.update({
                where: { id: existing.id },
                data: {
                    name: dto.name,
                    avatarUrl: dto.avatarUrl,
                    token: dto.token
                }
            })
            return this.encrypt(existing.username)
        } else {
            const newUser = await this.userService.createOne({
                data: {
                    username: dto.email,
                    role: Role.USER,
                    name: dto.name,
                    authType: dto.authType,
                    avatarUrl: dto.avatarUrl,
                    token: dto.token
                }
            })
            return this.encrypt(newUser.username)
        }
    }
    encrypt(email: string): string {
        const keyBuffer = Buffer.from(email).toString('base64');
        // let ivBuffer = Buffer.alloc(16);
        // const cipher = crypto.createCipheriv('aes256', keyBuffer, ivBuffer);
        // var encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
        return keyBuffer;
    }
    decrypt(hash: string): string {
        return Buffer.from(hash, 'base64').toString();;
        // const dechpher = crypto.createDecipheriv('aes256', 'password', 'IVIV')
        // var decrypted = dechpher.update(hash, 'hex', 'utf8') + dechpher.final('utf8');
        // return decrypted;
    }
}
