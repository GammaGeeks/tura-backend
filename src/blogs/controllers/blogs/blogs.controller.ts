import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateBlogDto } from 'src/blogs/dtos/CreateBlog.dto';
import { UpdateBlogDto } from 'src/blogs/dtos/UpdateBlog.dto';
import { BlogsService } from 'src/blogs/services/blogs/blogs.service';
import { JWTAuthGuard } from 'src/guards/jwt.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createBlog(
    @Req() req: Request,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const authorId = req.user?.['id'];

      if (!authorId) {
        throw new Error('Author ID not found in the request');
      }

      const blog = await this.blogsService.createBlog(file, {
        ...createBlogDto,
        author: {
          connect: { id: authorId },
        },
        category: {
          connect: { id: createBlogDto.categoryId },
        },
      });
      return blog;
    } catch (error) {
      throw error;
    }
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  async getBlog(
    @Param('identifier') identifier: string,
    @Query('include') include?: string,
  ) {
    const includeParams = include ? include.split(',') : [];

    let blog;
    if (/^\d+$/.test(identifier)) {
      blog = await this.blogsService.findBlogById(
        parseInt(identifier, 10),
        includeParams,
      );
    } else {
      blog = await this.blogsService.findBlogBySlug(identifier, includeParams);
    }

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return {
      data: blog,
      message: 'Blog retrieved successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('include') include?: string,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const includeParams = include ? include.split(',') : [];

    const result = await this.blogsService.findAllBlogs(
      pageNumber,
      limitNumber,
      includeParams,
    );

    return {
      message: 'Blogs retrieved successfully',
      data: result.blogs,
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
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateBlog(
    @Param('identifier') identifier: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let blog;
      if (/^\d+$/.test(identifier)) {
        blog = await this.blogsService.findBlogById(parseInt(identifier, 10));
      } else {
        blog = await this.blogsService.findBlogBySlug(identifier);
      }

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      const updatedBlog = await this.blogsService.updateBlog(
        blog.id,
        file,
        updateBlogDto,
      );

      return {
        message: 'Blog updated successfully',
        data: updatedBlog,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':identifier')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param('identifier') identifier: string,
    @Req() req: Request,
  ) {
    try {
      const authorId = req.user?.['id'];
      if (!authorId) {
        throw new BadRequestException('User ID is not available');
      }
      let blog;
      if (/^\d+$/.test(identifier)) {
        blog = await this.blogsService.findBlogById(parseInt(identifier, 10));
      } else {
        blog = await this.blogsService.findBlogBySlug(identifier);
      }

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }
      if (blog.author.id !== authorId) {
        throw new ForbiddenException('You can only delete your own blogs');
      }

      await this.blogsService.deleteBlog(blog.id);

      return {
        message: 'Blog deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
