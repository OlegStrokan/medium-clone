import { Controller } from '@nestjs/common';
import { UserService } from './services/user.service';
import {UserResponseDto} from "./interfaces/response-dtos/user-response.dto";
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "./interfaces/message-enums/message-pattern.enum";
import {UsersResponseDto} from "./interfaces/response-dtos/users-response.dto";
import {ValidateUserDto} from "./interfaces/request-dtos/validate-user.dto";

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

  @MessagePattern(MessagePatternEnum.USER_VALIDATE)
  async validateUser(dto: string): Promise<UserResponseDto> {
    return this.userService.validateUser(JSON.parse(dto));
  }

  @MessagePattern(MessagePatternEnum.USER_GET)
  async getUsers(): Promise<UsersResponseDto> {
    return this.userService.getUsers();
  }

  @MessagePattern(MessagePatternEnum.USER_CREATE)
  async createUser(jsonUserData: string): Promise<UserResponseDto> {
    return this.userService.createUser(JSON.parse(jsonUserData));
  }

  @MessagePattern(MessagePatternEnum.USER_UPDATE)
  async updateUser(jsonUserData: string): Promise<UserResponseDto> {
    return this.userService.updateUser(JSON.parse(jsonUserData));
  }

  @MessagePattern(MessagePatternEnum.USER_DELETE)
  async deleteUser(id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
