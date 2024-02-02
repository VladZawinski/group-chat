import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { PostGenerateToken } from './dto/post-generate-token.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('generateToken')
    generateToken(@Body() dto: PostGenerateToken) {
        return this.authService.generateToken(dto.username, dto.name)
    }
    @Post('signIn')
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto)
    }
}
