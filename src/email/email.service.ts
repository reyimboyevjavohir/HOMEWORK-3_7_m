import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>OTP Kodingiz</h2>
            <p style="font-size: 28px; font-weight: bold; color: #4CAF50;">${otp}</p>
            <p>Kod 5 daqiqa ichida amal qiladi.</p>
          </div>
        `,
      });
      this.logger.log(`OTP yuborildi: ${email}`);
    } catch (error) {
      this.logger.error(`Xato: ${email}`, error);
      throw new InternalServerErrorException('Email yuborishda xatolik');
    }
  }
}
