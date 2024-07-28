import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendGridClient } from './sendgrid-client';
import { BullModule } from '@nestjs/bull';

@Module({
  providers: [MailService, SendGridClient],
  exports: [MailService],
  imports: [
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
})
export class MailModule {}
