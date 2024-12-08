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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/categories/dtos/CreateCategory.dto';
import { UpdateCategoryDto } from 'src/categories/dtos/UpdateCategory.dto';
import { CategoriesService } from 'src/categories/services/categories/categories.service';
import { JWTAuthGuard } from 'src/guards/jwt.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);

    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCategory(
    @Param('id') id: string,
    @Query('include') include?: string,
  ) {
    const includeParams = include ? include.split(',') : [];
    const category = await this.categoriesService.findCategoryById(
      Number(id),
      includeParams,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCategories(
    @Query('include') include?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];

    const result = await this.categoriesService.findAllCategories(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Categories retrieved successfully',
      data: result.categories,
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
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findCategoryById(Number(id));

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoriesService.updateCategory(
      Number(id),
      updateCategoryDto,
    );

    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoriesService.findCategoryById(Number(id));

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesService.deleteCategory(Number(id));

    return {
      message: 'Category deleted successfully',
    };
  }
}
