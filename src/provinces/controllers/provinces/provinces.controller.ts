import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ProvincesService } from 'src/provinces/services/provinces/provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private provincesService: ProvincesService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProvince(
    @Param('id') id: number,
    @Query('include') include?: string,
  ) {
    const includeParams = include ? include.split(',') : [];
    const province = await this.provincesService.findProvinceById(
      Number(id),
      includeParams,
    );

    if (!province) {
      throw new NotFoundException(`Province with id ${id} not found`);
    }

    return {
      message: 'Province retrieved successfully',
      data: province,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllProvinces(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];
    const result = await this.provincesService.findAllProvinces(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Provinces retrieved successfully',
      data: result.provinces,
      meta: {
        total: result.total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(result.total / limitNumber),
        hasNextPage: pageNumber * limitNumber < result.total,
        hasPreviousPage: pageNumber > 1,
      },
    };
  }
}
