import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Application } from 'src/leave-application/entities/leave-application.entity';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  private readonly logger = new Logger(EmailService.name);

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Leave Management System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }

  async sendLeaveApplicationNotification(
    email: string,
    application: Application,
  ) {
    const subject = 'Leave Application Submitted';
    const text = `Your leave application (ID: ${application.leave_id}) has been submitted successfully.`;
    const html = `
      <div>
        <h2>Leave Application Submitted</h2>
        <p>Your leave application has been received:</p>
        <ul>
          <li>Application ID: ${application.leave_id}</li>
          <li>Leave Type: ${application.leave_type}</li>
          <li>Start Date: ${application.start_date}</li>
          <li>End Date: ${application.end_date}</li>
          <li>Status: ${application.status}</li>
        </ul>
        <p>You will be notified when your application is reviewed.</p>
      </div>
    `;

    await this.sendMail(email, subject, text, html);
  }
}
