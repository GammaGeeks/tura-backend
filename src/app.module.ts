import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WelcomeController } from './welcome/welcome.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth/auth.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, MailModule],
  providers: [JwtService, AuthService],
  controllers: [WelcomeController],
})
export class AppModule {}
