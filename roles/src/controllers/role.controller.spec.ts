import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from '../services/role.service';

describe('AppController', () => {
  let appController: RoleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService],
    }).compile();

    appController = app.get<RoleController>(RoleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
