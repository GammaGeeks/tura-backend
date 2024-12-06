import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WelcomeController } from './welcome/welcome.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth/auth.service';
import { MailModule } from './mail/mail.module';
import { S3Module } from './s3/s3.module';
import { PropertiesModule } from './properties/properties.module';
import { PlacesModule } from './places/places.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoriesModule } from './categories/categories.module';
import { SharesModule } from './shares/shares.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MailModule,
    S3Module,
    PropertiesModule,
    PlacesModule,
    BlogsModule,
    CategoriesModule,
    SharesModule,
  ],
  providers: [JwtService, AuthService],
  controllers: [WelcomeController],
})
export class AppModule {}
