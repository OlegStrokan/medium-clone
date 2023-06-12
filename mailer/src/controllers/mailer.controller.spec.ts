import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from './mailer.controller';
import { MailerService } from '../services/mailer.service';

describe('RoleController', () => {
  let appController: MailerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [MailerService],
    }).compile();

    appController = app.get<MailerController>(MailerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
