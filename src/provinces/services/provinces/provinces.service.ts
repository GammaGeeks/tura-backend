import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject(includeParams: string[]) {
    const defaultInclude = {
      districts: true,
    };

    if (includeParams.length === 0) return defaultInclude;

    const include: any = {};
    includeParams.forEach((param) => {
      switch (param) {
        case 'districts':
          include.districts = true;
          break;
        default:
          break;
      }
    });
    return include;
  }

  findProvinceById(id: number, includeParams: string[] = []) {
    return this.prisma.province.findUnique({
      where: { id },
      include: this.getIncludeObject(includeParams),
    });
  }

  async findAllProvinces(
    page: number,
    limit: number,
    includeParams: string[] = [],
  ) {
    const skip = (page - 1) * limit;
    const include = this.getIncludeObject(includeParams);
    const [provinces, total] = await Promise.all([
      this.prisma.province.findMany({
        skip,
        take: limit,
        include,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.province.count(),
    ]);

    return {
      provinces,
      total,
    };
  }
}
