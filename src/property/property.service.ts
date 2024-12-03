import { Injectable } from '@nestjs/common';

@Injectable()
export class PropertyService {
    async getAll(){
        return { getAll: "all properties" }
    }
}
