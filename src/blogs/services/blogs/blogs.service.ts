import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/services/s3.service';
import { SlugUtils } from 'src/utils/slug.utils';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      author: {
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          profileImg: true,
        },
      },
      category: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'author':
          include.author = defaultInclude.author;
          break;
        case 'category':
          include.category = true;
          break;
        // Add more cases as needed
      }
    });
    return include;
  }

  async createBlog(file: Express.Multer.File, data: Prisma.BlogCreateInput) {
    const baseSlug = SlugUtils.sanitizeSlug(data.title);
    const slug: string = await SlugUtils.generateUniqueSlug(
      this.prisma,
      baseSlug,
    );
    const folder = `blogs`;
    const key = await this.s3Service.uploadFile(file, folder);

    const url = await this.s3Service.generateSignedUrl(key);

    const blog = await this.prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        featuredImg: url,
        slug: slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        author: true,
        category: true,
      },
    });

    return blog;
  }

  async findBlogById(id: number, includeParams: string[] = []) {
    const include = this.getIncludeObject(includeParams);

    return await this.prisma.blog.findUnique({
      where: { id },
      include,
    });
  }

  findBlogBySlug(slug: string, includeParams: string[] = []) {
    const include = this.getIncludeObject(includeParams);
    return this.prisma.blog.findUnique({
      where: { slug },
      include,
    });
  }

  async findAllBlogs(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);

    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.blog.count(),
    ]);

    return {
      blogs,
      total,
    };
  }

  async updateBlog(
    id: number,
    file: Express.Multer.File,
    data: Prisma.BlogUpdateInput,
  ) {
    // If the update includes a title, you might want to update the slug
    const { title } = data as { title: string };
    let slug: string;
    if (title) {
      const baseSlug = SlugUtils.sanitizeSlug(title);
      slug = await SlugUtils.generateUniqueSlug(this.prisma, baseSlug);
    }

    let url: string | null = null;
    if (file) {
      const folder = `blogs`;
      const key = await this.s3Service.uploadFile(file, folder);
      url = await this.s3Service.generateSignedUrl(key);
    }
    const updatedData = {
      ...data,
      ...(slug && { slug }),
      ...(url && { featuredImg: url }),
      updatedAt: new Date(),
    };

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: updatedData,
      include: {
        author: true,
        category: true,
      },
    });

    return updatedBlog;
  }

  async deleteBlog(id: number) {
    const blog = await this.findBlogById(id);

    if (blog?.featuredImg) {
      await this.s3Service.deleteFile(blog.featuredImg);
    }

    return await this.prisma.blog.delete({
      where: { id },
    });
  }
}
