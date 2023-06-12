import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  getHello(): string {
    return 'Hello World!';
  }
}
