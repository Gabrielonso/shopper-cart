import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendGridClient } from './sendgrid-client';
import { ConfigService } from '@nestjs/config';

@Processor('emails')
export class EmailProcessor {
  constructor(
    private readonly sendGridClient: SendGridClient,
    private configService: ConfigService,
  ) {}
  @Process('sendWelcomeEmail')
  async handleSendEmail(job: Job) {
    console.log('send email');
    const { email } = job.data;
    const msg = {
      to: email,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Welcome to Shopper Cart',
      text: 'Thank you for registering with our service.',
      html: '<strong>Thank you for registering with our service.</strong>',
    };

    const result = await this.sendGridClient.send(msg);
  }
}
