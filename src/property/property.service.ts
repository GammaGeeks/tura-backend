import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
    constructor( private prisma: PrismaService){}
    async getAll(){
        return await this.prisma.property.findMany()
    }
}
