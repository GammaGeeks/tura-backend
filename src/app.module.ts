import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { WelcomeController } from './welcome/welcome.controller';

@Module({
  imports: [PrismaModule],
  providers: [JwtModule],
  controllers: [WelcomeController]
})

export class AppModule {}
