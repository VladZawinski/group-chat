import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { decrypt } from 'src/common/hash-utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailAuthKeyGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['hash'];
    if(key == null) {
        return false
    }
    const decrypted = decrypt(key);
    const user = await this.userService.findOne(decrypted);
    if(user == null) {
        return false
    }
    request.userId = user.id
    return true
  }
}