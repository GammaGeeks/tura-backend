import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    async login(dto){
        const user = await this.prisma.users.findUnique({
            where: {
                email: dto.email
            }
        })

        if(!user) throw new ForbiddenException('invalid credentials')
        
        const pwCheck:boolean = await argon.verify(user.password, dto.password)
        
        if(!pwCheck) throw new ForbiddenException('invalid credentials')

        return 'authenticated !'    
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
        delete user.createdAt
        delete user.updatedAt
        delete user.password
        delete user.id

        return {
            message: 'user is created successfully',
            user
        }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new BadRequestException('email already taken')
                }
            }
        }
    }
}
