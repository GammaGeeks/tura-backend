import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';
import { PropertiesService } from './services/properties/properties.service';
import { PropertiesController } from './controllers/properties/properties.controller';

@Module({
  imports: [PrismaModule, S3Module],
  providers: [PropertiesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
