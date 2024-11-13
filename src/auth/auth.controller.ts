import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, registerDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signin')
    async signIn(@Body() dto: loginDto){
        return this.authService.login(dto.email)
    }

    @Post('signup')
    async signUp(@Body() dto: registerDto){
        return this.authService.register(dto)
    }
}
