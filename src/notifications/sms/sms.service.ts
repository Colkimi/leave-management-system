import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private client = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  async sendSms(to: string, body: string) {
    await this.client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}
