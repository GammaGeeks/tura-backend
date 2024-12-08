import { Module } from '@nestjs/common';
import { ProvincesService } from './services/provinces/provinces.service';
import { ProvincesController } from './controllers/provinces/provinces.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProvincesService],
  controllers: [ProvincesController],
})
export class ProvincesModule {}
