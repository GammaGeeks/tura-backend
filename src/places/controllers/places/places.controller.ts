import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from 'src/guards/jwt.guard';
import { CreatePlaceDto } from 'src/places/dtos/CreatePlace.dto';
import { UpdatePlaceDto } from 'src/places/dtos/UpdatePlace.dto';
import { PlacesService } from 'src/places/services/places/places.service';

@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createPlace(
    @Body() createPlaceDto: CreatePlaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { sectorId, ...rest } = createPlaceDto;
    const place = await this.placesService.createPlace(file, {
      ...rest,
      sector: {
        connect: { id: Number(sectorId) },
      },
    });

    return place;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlace(@Param('id') id: number, @Query('include') include?: string) {
    const includeParams = include ? include.split(',') : [];
    const place = await this.placesService.findPlaceById(
      Number(id),
      includeParams,
    );

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    return {
      data: place,
      message: 'Place retrieved successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPlaces(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];

    const result = await this.placesService.findAllPlaces(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Places retrieved successfully',
      data: result.places,
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
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updatePlace(
    @Param('id') id: number,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const placeExists = await this.placesService.findPlaceById(Number(id));

    if (!placeExists) {
      throw new NotFoundException('Place not found');
    }
    const { sectorId, ...rest } = updatePlaceDto;
    const place = await this.placesService.updatePlace(placeExists.id, file, {
      ...rest,
      sector: {
        connect: { id: Number(sectorId) },
      },
    });

    return {
      message: 'Place updated successfully',
      data: place,
    };
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id') id: number) {
    const placeExists = await this.placesService.findPlaceById(Number(id));

    if (!placeExists) {
      throw new NotFoundException('Place not found');
    }

    await this.placesService.deletePlace(Number(id));

    return {
      message: 'Place deleted successfully',
    };
  }
}
