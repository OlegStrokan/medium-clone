import { Controller, Get } from '@nestjs/common';
import { UserService } from './services/user.service';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  registration(): string {
    return this.appService.getHello();
  },
}
