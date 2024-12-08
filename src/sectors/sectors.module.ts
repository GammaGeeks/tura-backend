import { Module } from '@nestjs/common';
import { SectorsController } from './controllers/sectors/sectors.controller';
import { SectorsService } from './services/sectors/sectors.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SectorsController],
  providers: [SectorsService],
})
export class SectorsModule {}
