import { Module } from '@nestjs/common';
import { MailerController } from './controllers/mailer.controller';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
