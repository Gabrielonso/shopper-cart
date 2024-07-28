import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendGridClient } from './sendgrid-client';

@Processor('emails')
export class EmailProcessor {
  constructor(private readonly sendGridClient: SendGridClient) {}
  @Process('sendWelcomeEmail')
  async handleSendEmail(job: Job) {
    const { email } = job.data;
    const msg = {
      to: email,
      from: 'noreply@example.com',
      subject: 'Welcome to Our Service',
      text: 'Thank you for registering with our service.',
      html: '<strong>Thank you for registering with our service.</strong>',
    };
    console.log('<<>>medsg>>', msg);
    const result = await this.sendGridClient.send(msg);
    console.log(result);
  }
}
