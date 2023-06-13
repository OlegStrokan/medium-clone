import { Controller, Get } from '@nestjs/common';
import { UserRolesService } from '../services/user-roles.service';

@Controller()
export class UserRolesController {
  constructor(private readonly appService: UserRolesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
