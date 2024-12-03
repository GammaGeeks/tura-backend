import { Controller, Get } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
    constructor(private propertyService: PropertyService){}
    @Get()
    async allProperties(){
        return this.propertyService.getAll()
    }
}
