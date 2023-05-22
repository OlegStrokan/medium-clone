import { Controller } from '@nestjs/common';
import { UserService } from './services/user.service';
import {UserResponseDto} from "./interfaces/response-dtos/user-response.dto";
import {CreateUserDto} from "./interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "./interfaces/request-dtos/update-user.dto";
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "./interfaces/message-enums/message-pattern.enum";
import {UsersResponseDto} from "./interfaces/response-dtos/users-response.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @MessagePattern(MessagePatternEnum.USER_GET_BY_ID)
  async getUser(id: string): Promise<UserResponseDto> {
    return this.userService.getUser(id);
  }

  @MessagePattern(MessagePatternEnum.USER_GET_BY_EMAIL)
  async getUserByEmail(email: string): Promise<UserResponseDto> {
    return this.userService.getUserByEmail(email);
  }

  @MessagePattern(MessagePatternEnum.USER_GET)
  async getUsers(): Promise<UsersResponseDto> {
    return this.userService.getUsers();
  }

  @MessagePattern(MessagePatternEnum.USER_CREATE)
  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(userData);
  }

  @MessagePattern(MessagePatternEnum.USER_UPDATE)
  async updateUser(userData: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(userData);
  }

  @MessagePattern(MessagePatternEnum.USER_DELETE)
  async deleteUser(id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
