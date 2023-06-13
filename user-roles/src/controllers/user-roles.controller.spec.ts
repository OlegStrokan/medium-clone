import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from '../services/user-roles.service';

describe('AppController', () => {
  let appController: UserRolesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [UserRolesService],
    }).compile();

    appController = app.get<UserRolesController>(UserRolesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
