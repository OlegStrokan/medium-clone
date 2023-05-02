import {Body, Controller, Get, Param} from '@nestjs/common';
import { UserService } from './services/user.service';
import {IUser} from "./interfaces/IUser";
import {UserResponseDto} from "./interfaces/response-dtos/user-response.dto";
import {CreateUserDto} from "./interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "./interfaces/request-dtos/update-user.dto";
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "./interfaces/message-enums/message-pattern.enum";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @MessagePattern(MessagePatternEnum.GET_USER)
  async getUser(id: string): Promise<UserResponseDto> {
    return this.userService.getUser(id);
  }

  @MessagePattern(MessagePatternEnum.GET_USERS)
  async getUsers(id: string): Promise<UserResponseDto> {
    return this.userService.getUser(id);
  }

  @MessagePattern(MessagePatternEnum.CREATE_USER)
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(userData);
  }

  @MessagePattern(MessagePatternEnum.UPDATE_USER)
  async updateUser(userData: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(userData);
  }

  @MessagePattern(MessagePatternEnum.DELETE_USER)
  async deleteUser(id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
