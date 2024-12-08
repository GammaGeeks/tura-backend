import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      province: true,
      sectors: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'province':
          include.province = true;
          break;
        case 'sectors':
          include.sectors = true;
          break;
        default:
          break;
      }
    });
    return include;
  }

  findDistrictById(id: number, includeParams: string[] = []) {
    return this.prisma.district.findUnique({
      where: { id },
      include: this.getIncludeObject(includeParams),
    });
  }

  async findAllDistricts(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);

    const [districts, total] = await Promise.all([
      this.prisma.district.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.district.count(),
    ]);

    return {
      districts,
      total,
    };
  }
}
