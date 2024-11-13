import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService
    ){}
    async login(dto){
        const user = await this.prisma.users.findUnique({
            where: {
                email: dto.email
            }
        })

        if(!user) throw new ForbiddenException('invalid credentials')
        
        const pwCheck:boolean = await argon.verify(user.password, dto.password)
        
        if(!pwCheck) throw new ForbiddenException('invalid credentials')

        return { token: await this.signToken(user.id, user.email) }    
     }

    async register(dto){
    try {
    const hashedPassword: string = await argon.hash(dto.password)
        const user = await this.prisma.users.create({
            data: {
                name: dto.name,
                password: hashedPassword,
                email: dto.email
            }
        })

        return { token: await this.signToken(user.id, user.email) }

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new BadRequestException('email already taken')
                }
            }
        }
    }

    async signToken(id: number, email: string): Promise<string>{
        const payload: object={
            sub: id,
            email
        }
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET
        })
    }
}
