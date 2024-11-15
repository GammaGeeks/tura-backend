import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `http://${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;
    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the link: ${verificationUrl}`,
        html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
      });
      console.log('Mailgun response:', response);
    } catch (error) {
      console.log('Mailgun error:', error);
      throw new HttpException(
        'Email service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
