import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    
    async generateToken(email: string, name: string): Promise<string> {
        const existing = await this.userService.findOne(email);
        if(existing != null) {
            return this.encrypt(existing.username)
        } else {
            const newUser = await this.userService.createOne({
                data: {
                    username: email,
                    role: Role.USER,
                    name: name
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
