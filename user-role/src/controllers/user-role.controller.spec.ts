import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleController } from './user-role.controller';
import { UserRolesService } from '../services/user-roles.service';

describe('AppController', () => {
  let appController: UserRoleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserRoleController],
      providers: [UserRolesService],
    }).compile();

    appController = app.get<UserRoleController>(UserRoleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
