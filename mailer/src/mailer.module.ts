import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
