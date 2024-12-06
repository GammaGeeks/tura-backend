import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Logger,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Param,
  Query,
  Get,
  NotFoundException,
  Patch,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/guards/jwt.guard';
import { CreatePropertyDto } from 'src/properties/dtos/CreateProperty.dto';
import { UpdatePropertyDto } from 'src/properties/dtos/UpdateProperty.dto';
import { PropertiesService } from 'src/properties/services/properties/properties.service';

@Controller('properties')
export class PropertiesController {
  private readonly logger = new Logger(PropertiesController.name);

  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createProperty(
    @Req() req: Request,
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    try {
      const userId = req.user?.['id'];
      if (!userId) {
        throw new BadRequestException('User ID is not available');
      }

      const imageUrls = files
        ? await this.propertiesService.uploadPropertyImages(files)
        : [];

      const property = await this.propertiesService.createProperty({
        ...createPropertyDto,
        imageUrls,
        owner: {
          connect: { id: userId },
        },
        category: createPropertyDto.category
          ? {
              connect: { id: createPropertyDto.category.connect.id },
            }
          : undefined,
        place: createPropertyDto.place
          ? {
              connect: { id: createPropertyDto.place.connect.id },
            }
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        shares: {
          create: [],
        },
      });

      return {
        message: 'Property created successfully',
        data: property,
      };
    } catch (error) {
      this.logger.error(`Failed to create property: ${error.message}`);
      throw error;
    }
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  async getProperty(
    @Param('identifier') identifier: string,
    @Query('include') include?: string,
  ) {
    const includeParams = include ? include.split(',') : [];

    let property;
    if (/^\d+$/.test(identifier)) {
      property = await this.propertiesService.findPropertyById(
        parseInt(identifier, 10),
        includeParams,
      );
    } else {
      property = await this.propertiesService.findPropertyBySlug(
        identifier,
        includeParams,
      );
    }

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return {
      message: 'Property retrieved successfully',
      data: property,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProperties(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    // Convert to numbers and ensure positive values
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];

    const result = await this.propertiesService.findAllProperties(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Properties retrieved successfully',
      data: result.properties,
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

  @Patch(':identifier')
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async updateProperty(
    @Param('identifier') identifier: string,
    @Req() req: Request,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    try {
      const userId = req.user?.['id'];
      if (!userId) {
        throw new BadRequestException('User ID is not available');
      }

      // First check if the property exists and belongs to the user
      let existingProperty;

      // Check if identifier is a number (ID) or string (slug)
      const isId = !isNaN(Number(identifier));

      if (isId) {
        existingProperty = await this.propertiesService.findPropertyById(
          parseInt(identifier),
          [],
        );
      } else {
        existingProperty = await this.propertiesService.findPropertyBySlug(
          identifier,
          [],
        );
      }

      if (!existingProperty) {
        throw new NotFoundException('Property not found');
      }

      if (existingProperty.owner.id !== userId) {
        throw new ForbiddenException('You can only update your own properties');
      }

      // Handle new image uploads if any
      let newImageUrls: string[] = [];
      if (files && files.length > 0) {
        newImageUrls = await this.propertiesService.uploadPropertyImages(files);
      }

      // Prepare update data
      const updateData = {
        ...updatePropertyDto,
        updatedAt: new Date(),
        // Append new images to existing ones if needed
        imageUrls:
          newImageUrls.length > 0
            ? [...(existingProperty.imageUrls || []), ...newImageUrls]
            : undefined,
        // Handle category update if provided
        category: updatePropertyDto.categoryId
          ? {
              connect: { id: updatePropertyDto.categoryId },
            }
          : undefined,
        // Handle place update if provided
        place: updatePropertyDto.placeId
          ? {
              connect: { id: updatePropertyDto.placeId },
            }
          : undefined,
      };

      const updatedProperty = await this.propertiesService.updateProperty(
        existingProperty.id, // Use the actual ID for updating
        updateData,
      );

      return {
        message: 'Property updated successfully',
        data: updatedProperty,
      };
    } catch (error) {
      this.logger.error(`Failed to update property: ${error.message}`);
      throw error;
    }
  }

  @Delete(':identifier')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProperty(
    @Param('identifier') identifier: string,
    @Req() req: Request,
  ) {
    try {
      const userId = req.user?.['id'];
      if (!userId) {
        throw new BadRequestException('User ID is not available');
      }

      // Check if property exists and belongs to the user
      let existingProperty;

      // Check if identifier is a number (ID) or string (slug)
      const isId = !isNaN(Number(identifier));

      if (isId) {
        existingProperty = await this.propertiesService.findPropertyById(
          parseInt(identifier),
          [],
        );
      } else {
        existingProperty = await this.propertiesService.findPropertyBySlug(
          identifier,
          [],
        );
      }

      if (!existingProperty) {
        throw new NotFoundException('Property not found');
      }

      // Check if the user owns the property
      if (existingProperty.owner.id !== userId) {
        throw new ForbiddenException('You can only delete your own properties');
      }

      // Delete the property
      await this.propertiesService.deleteProperty(existingProperty.id);

      return {
        message: 'Property deleted successfully',
        data: null,
      };
    } catch (error) {
      this.logger.error(`Failed to delete property: ${error.message}`);
      throw error;
    }
  }
}
