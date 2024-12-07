import { Module } from '@nestjs/common';
import { BlogsService } from './services/blogs/blogs.service';
import { BlogsController } from './controllers/blogs/blogs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
