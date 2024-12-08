import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SectorsService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      places: true,
      district: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'places':
          include.places = true;
          break;
        case 'district':
          include.district = true;
          break;
        default:
          break;
      }
    });
    return include;
  }

  createSector(data: Prisma.SectorCreateInput) {
    return this.prisma.sector.create({
      data: {
        name: data.name,
        district: data.district,
      },
    });
  }

  updateSector(id: number, data: Prisma.SectorUpdateInput) {
    return this.prisma.sector.update({
      where: { id },
      data: {
        name: data.name,
        district: data.district,
      },
    });
  }

  findSectorById(id: number, includeParams: string[] = []) {
    return this.prisma.sector.findUnique({
      where: { id },
      include: this.getIncludeObject(includeParams),
    });
  }

  async findAllSectors(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);
    const [sectors, total] = await Promise.all([
      this.prisma.sector.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.sector.count(),
    ]);

    return {
      sectors,
      total,
    };
  }

  deleteSector(id: number) {
    return this.prisma.sector.delete({
      where: { id },
    });
  }
}
