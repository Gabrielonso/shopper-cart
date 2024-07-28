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
  //   body = 'Welcome to Easy Cart',
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

  async sendEmailWithTemplate(recipient: string, body: string): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      cc: 'example@mail.com', //Assuming you want to send a copy to this email
      from: 'noreply@domain.com', //Approved sender ID in Sendgrid
      templateId: 'Sendgrid_template_ID', //Retrieve from config service or environment variable
      dynamicTemplateData: { body, subject: 'Send Email with template' }, //The data to be used in the template
    };
    await this.sendGridClient.send(mail);
  }
}
