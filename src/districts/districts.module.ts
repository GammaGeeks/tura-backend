import { Module } from '@nestjs/common';
import { DistrictsController } from './controllers/districts/districts.controller';
import { DistrictsService } from './services/districts/districts.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
