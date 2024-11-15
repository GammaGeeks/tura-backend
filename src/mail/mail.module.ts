/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './services/mail/mail.service';
import * as mailgun from 'mailgun-js';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: process.env.MAILGUN_SMTP_USERNAME,
          pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@tura.estate>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
