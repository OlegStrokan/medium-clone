import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRolesService {
  getHello(): string {
    return 'Hello World!';
  }
}
