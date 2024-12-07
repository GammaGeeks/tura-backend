import { Module } from '@nestjs/common';
import { PlacesController } from './controllers/places/places.controller';
import { PlacesService } from './services/places/places.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
