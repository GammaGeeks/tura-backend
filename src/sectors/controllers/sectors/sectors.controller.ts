import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  Delete,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SectorsService } from 'src/sectors/services/sectors/sectors.service';
import { CreateSectorDto } from 'src/sectors/dtos/CreateSector.dto';
import { UpdateSectorDto } from 'src/sectors/dtos/UpdateSector.dto';
import { JWTAuthGuard } from 'src/guards/jwt.guard';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async createSector(@Body() createSectorDto: CreateSectorDto) {
    const { name, districtId } = createSectorDto;
    const sector = await this.sectorsService.createSector({
      name,
      district: { connect: { id: districtId } },
    });

    return {
      message: 'Sector created successfully',
      data: sector,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSector(@Param('id') id: number, @Query('include') include?: string) {
    const includeParams = include ? include.split(',') : [];
    const sector = await this.sectorsService.findSectorById(
      Number(id),
      includeParams,
    );

    if (!sector) {
      throw new NotFoundException(`Sector with id ${id} not found`);
    }

    return { message: 'Sector retrieved successfully', data: sector };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllSectors(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];
    const result = await this.sectorsService.findAllSectors(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Sectors retrieved successfully',
      data: result.sectors,
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

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async updateSector(
    @Param('id') id: number,
    @Body() updateSectorDto: UpdateSectorDto,
  ) {
    const sector = await this.sectorsService.findSectorById(Number(id));

    if (!sector) {
      throw new NotFoundException(`Sector with id ${id} not found`);
    }

    const { name, districtId } = updateSectorDto;
    const updatedSector = await this.sectorsService.updateSector(Number(id), {
      name,
      district: districtId ? { connect: { id: districtId } } : undefined,
    });

    return {
      message: 'Sector updated successfully',
      data: updatedSector,
    };
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSector(@Param('id') id: number) {
    const sector = await this.sectorsService.findSectorById(Number(id));

    if (!sector) {
      throw new NotFoundException(`Sector with id ${id} not found`);
    }

    return await this.sectorsService.deleteSector(Number(id));
  }
}
