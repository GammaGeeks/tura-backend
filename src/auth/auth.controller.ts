import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  registerDto, loginDto } from './dto';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signin')
    @ApiOperation({ summary: 'logging in a user'})
    @ApiCreatedResponse({ 
        description: 'created', 
        type: loginDto,
        example: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEB0LmFpIiwiaWF0IjoxNzMxNTYyMTAxfQ.dmm1fq66Ugs-2Q6m_Rn5vZbhIrmVjMG7_tDG_jR_qMs"
    }})
    @ApiForbiddenResponse({ 
        description: 'invalid credentials',
        example: {
            "message": "invalid credentials",
            "error": "Forbidden",
            "statusCode": 403
        }
     })
    async signIn(@Body() dto: loginDto){
        return this.authService.login(dto)
    }
    
    @ApiOperation({ summary: 'registering a user' })
    @ApiCreatedResponse({ 
        description: 'created', 
        type: registerDto,
        example: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEB0LmFpIiwiaWF0IjoxNzMxNTYyMTAxfQ.dmm1fq66Ugs-2Q6m_Rn5vZbhIrmVjMG7_tDG_jR_qMs"
    }})
    @ApiForbiddenResponse({ 
        description: 'invalid credentials',
        example: {
            "message": "invalid credentials",
            "error": "Forbidden",
            "statusCode": 403
        }
     })
    @Post('signup')
    async signUp(@Body() dto: registerDto){
        return this.authService.register(dto)
    }
}
