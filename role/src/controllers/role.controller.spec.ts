import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from '../services/role.service';
import {IRole} from "../interfaces/IRole";

describe('UserRoleController', () => {
  let appController: RoleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService],
    }).compile();

    appController = app.get<RoleController>(RoleController);
  });

  const role: IRole = {
      id: '1',
      value: 'admin',
      description: 'This is admin permission'
  }

  const jsonRole = JSON.stringify(role);

  describe('root', () => {
    it('should call createRole with parsed JSON and return correct data', () => {


      expect(appController.createRole).toHaveBeenCalledWith(jsonRole);
    });
  });
});
