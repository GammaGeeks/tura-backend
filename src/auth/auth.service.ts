import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private authService: PrismaService){}
     async login(dto){
        return dto
    }
    
     async register(dto){
        return dto
    }
}
