import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/services/s3.service';
import { SlugUtils } from 'src/utils/slug.utils';

@Injectable()
export class PropertiesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      owner: {
        select: {
          id: true,
          username: true,
          fullname: true,
          email: true,
          profileImg: true,
        },
      },
      category: true,
      place: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'owner':
          include.owner = defaultInclude.owner;
          break;
        case 'category':
          include.category = true;
          break;
        case 'place':
          include.place = true;
          break;
        case 'shares':
          include.shares = true;
          break;
        // Add more cases as needed
      }
    });
    return include;
  }

  async createProperty(data: Prisma.PropertyCreateInput) {
    const baseSlug = SlugUtils.sanitizeSlug(data.title);
    const slug: string = await SlugUtils.generateUniqueSlug(
      this.prisma,
      baseSlug,
    );

    const propertyData = {
      ...data,
      slug,
    };
    return this.prisma.property.create({
      data: propertyData,
      include: {
        owner: true,
        category: true,
        place: true,
        shares: true,
      },
    });
  }

  async findAllProperties(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count(),
    ]);

    return {
      properties,
      total,
    };
  }

  async findPropertyById(id: number, includeParams: string[] = []) {
    const include = this.getIncludeObject(includeParams);

    return await this.prisma.property.findUnique({
      where: { id },
      include,
    });
  }

  findPropertyBySlug(slug: string, includeParams: string[] = []) {
    const include = this.getIncludeObject(includeParams);
    return this.prisma.property.findUnique({
      where: { slug },
      include,
    });
  }

  async updateProperty(id: number, updateData: Prisma.PropertyUpdateInput) {
    const { category, place, imageUrls, ...basicData } = updateData;

    // Prepare the update object
    const updateObject: any = {
      ...basicData,
      updatedAt: new Date(),
    };

    // Handle category relationship if provided
    if (category) {
      updateObject.category = {
        connect: {
          id: category.connect.id,
        },
      };
    }

    // Handle place relationship if provided
    if (place) {
      updateObject.place = {
        connect: {
          id: place.connect.id,
        },
      };
    }

    // Handle imageUrls if provided
    if (imageUrls) {
      updateObject.imageUrls = imageUrls;
    }

    // Perform the update operation
    const updatedProperty = await this.prisma.property.update({
      where: {
        id,
      },
      data: updateObject,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            profileImg: true,
          },
        },
        category: true,
        place: true,
        // Include any other related data you need
      },
    });

    // If the update includes a title, you might want to update the slug
    const { title } = updateData as { title: string };
    if (title) {
      const baseSlug = SlugUtils.sanitizeSlug(title);
      const slug: string = await SlugUtils.generateUniqueSlug(
        this.prisma,
        baseSlug,
      );
      await this.prisma.property.update({
        where: { id },
        data: { slug },
      });
    }

    return updatedProperty;
  }

  async deleteProperty(id: number) {
    // First, delete any associated images from storage if needed
    const property = await this.prisma.property.findUnique({
      where: { id },
      select: { imageUrls: true },
    });

    if (property?.imageUrls) {
      // Delete images from storage (implement this based on your storage solution)
      await this.s3Service.deletePropertyImages(property.imageUrls);
    }

    // Delete the property from the database
    await this.prisma.property.delete({
      where: { id },
    });

    return true;
  }

  async uploadPropertyImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      // Upload files to S3 and get the URLs
      const uploadPromises = files.map(async (file) => {
        const folder = `properties`;
        const key = await this.s3Service.uploadFile(file, folder);
        const url = this.s3Service.generateSignedUrl(key);
        return url;
      });

      // Wait for all uploads to complete and get the URLs
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls;
    } catch (error) {
      throw new Error(`Failed to upload property images: ${error.message}`);
    }
  }
}
