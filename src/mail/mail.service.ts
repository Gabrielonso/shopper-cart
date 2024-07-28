import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    private readonly sendGridClient: SendGridClient,
    @InjectQueue('emails') private emailQueue: Queue,
  ) {}

  // async sendWelcomeEmail(
  //   recipient: string,
  //   body = 'Welcome to Shopper Cart',
  // ): Promise<void> {
  //   const mail: MailDataRequired = {
  //     to: recipient,
  //     from: 'gabitgabriel1@gmail.com',
  //     subject: 'Test email',
  //     content: [{ type: 'text/plain', value: body }],
  //   };
  //   await this.sendGridClient.send(mail);
  // }

  async sendWelcomeEmail(email: string) {
    const job = await this.emailQueue.add('sendWelcomeEmail', { email });

    return { jobId: job.id };
  }
}
