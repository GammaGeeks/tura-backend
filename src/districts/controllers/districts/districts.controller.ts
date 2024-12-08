import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { DistrictsService } from 'src/districts/services/districts/districts.service';

@Controller('districts')
export class DistrictsController {
  constructor(private districtsService: DistrictsService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDistrict(
    @Param('id') id: number,
    @Query('include') include?: string,
  ) {
    const includeParams = include ? include.split(',') : [];
    const province = await this.districtsService.findDistrictById(
      Number(id),
      includeParams,
    );

    if (!province) {
      throw new NotFoundException(`District with id ${id} not found`);
    }

    return {
      message: 'District retrieved successfully',
      data: province,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllDistricts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];
    const result = await this.districtsService.findAllDistricts(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Districts retrieved successfully',
      data: result.districts,
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
