import {Body, Controller, Get, Param} from '@nestjs/common';
import { UserService } from './services/user.service';
import {IUser} from "./interfaces/IUser";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  async getUsers(): Promise<IUser[]> {
    return this.userService.getUser();
  }

  async createUser(@Body() userData: IUser): Promise<IUser> {
    return this.userService.createUser(userData);
  }

  async updateUser(@Param('id') id: number, @Body() userData: Partial<IUser>): Promise<IUser> {
    return this.userService.updateUser(id, userData);
  }

  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
