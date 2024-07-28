import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly sendGridClient: SendGridClient,
    @InjectQueue('emails') private emailQueue: Queue,
    private configService: ConfigService,
  ) {}

  async sendWelcomeEmail(
    receipientEmail: string,
    body = 'Thank you for registering with our service.',
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: receipientEmail,
      from: this.configService.get<string>('MAIL_USER'),
      subject: 'Welcome to Shopper Cart',
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  // async sendWelcomeEmail(receipientEmail: string) {
  //   const job = await this.emailQueue.add('sendWelcomeEmail', {
  //     email: receipientEmail,
  //   });

  //   return { jobId: job.id };
  // }
}
