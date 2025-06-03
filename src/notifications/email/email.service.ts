import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"Admin Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
