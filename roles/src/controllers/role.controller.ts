import { Controller, Get } from '@nestjs/common';
import { RoleService } from '../services/role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  createRole() {

  }

  getRoleByValue() {

  }

  getRoles () {

  }
}
