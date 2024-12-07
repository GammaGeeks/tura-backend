import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/services/s3.service';

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}
  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      sector: {
        select: {
          id: true,
          name: true,
          district: {
            select: {
              id: true,
              name: true,
              province: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      properties: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'sector':
          include.sector = defaultInclude.sector;
          break;
        case 'properties':
          include.properties = true;
          break;
        // Add more cases as needed
      }
    });
    return include;
  }

  async createPlace(file: Express.Multer.File, data: Prisma.PlaceCreateInput) {
    const folder = `places`;
    const key = await this.s3Service.uploadFile(file, folder);
    const url = await this.s3Service.generatePrivateSignedUrl(key);
    const place = await this.prisma.place.create({
      data: {
        ...data,
        featuredImg: url,
        createdAt: new Date(),
      },
      include: {
        sector: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true,
                province: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        properties: true,
      },
    });

    return place;
  }

  async findPlaceById(id: number, includeParams: string[] = []) {
    const include = this.getIncludeObject(includeParams);

    return await this.prisma.place.findUnique({
      where: { id },
      include,
    });
  }

  async findAllPlaces(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);

    const [places, total] = await Promise.all([
      this.prisma.place.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.place.count(),
    ]);

    return {
      places,
      total,
    };
  }

  async updatePlace(
    id: number,
    file: Express.Multer.File,
    data: Prisma.PlaceUpdateInput,
  ) {
    let url: string | null = null;
    if (file) {
      const folder = `places`;
      const key = await this.s3Service.uploadFile(file, folder);
      url = await this.s3Service.generateSignedUrl(key);
    }
    const updatedPlace = await this.prisma.place.update({
      where: { id },
      data: {
        ...data,
        ...(url && { featuredImg: url }),
        sector: data.sector?.connect?.id
          ? {
              connect: { id: data.sector.connect.id as number },
            }
          : undefined,
      },
      include: {
        sector: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true,
                province: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        properties: true,
      },
    });

    return updatedPlace;
  }

  async deletePlace(id: number) {
    const place = await this.findPlaceById(id);

    if (place?.featuredImg) {
      await this.s3Service.deleteFile(place.featuredImg);
    }

    return await this.prisma.place.delete({
      where: { id },
    });
  }
}
