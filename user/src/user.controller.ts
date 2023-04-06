import {Body, Controller, Get, Param} from '@nestjs/common';
import { UserService } from './services/user.service';
import {IUser} from "./interfaces/IUser";
import {UserResponseDto} from "./interfaces/response-dtos/user-response.dto";
import {CreateUserDto} from "./interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "./interfaces/request-dtos/update-user.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  async getUsers(id: string): Promise<UserResponseDto> {
    return this.userService.getUser(id);
  }

  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(userData);
  }

  async updateUser(userData: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(userData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
