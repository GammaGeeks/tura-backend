import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject(includeParams: string[]) {
    // Default include structure
    const defaultInclude = {
      properties: true, // Include related properties
      blogs: true, // Include related blogs
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'properties':
          include.properties = true; // Include related properties
          break;
        case 'blogs':
          include.blogs = true; // Include related blogs
          break;
        // Add more cases as needed
        default:
          break;
      }
    });
    return include;
  }

  createCategory(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  findCategoryById(id: number, includeParams: string[] = []) {
    return this.prisma.category.findUnique({
      where: { id },
      include: this.getIncludeObject(includeParams),
    });
  }

  async findAllCategories(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);
    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.category.count(),
    ]);

    return {
      categories,
      total,
    };
  }

  updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
