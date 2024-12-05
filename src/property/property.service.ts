import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
    constructor( private prisma: PrismaService){}
    async getAll(){
        const property:object[] = await this.prisma.property.findMany({
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return {
            message: "properties found",
            property
        }
    }
}
