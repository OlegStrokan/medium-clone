import {Controller} from '@nestjs/common';
import {UserService} from './services/user.service';
import {ResponseUserCreateDto} from "./interfaces/response-dto/ResponseUserCreateDto";
import {UserCreateDto} from "./interfaces/dto/UserCreateDto";
import {ResponseUserDto} from "./interfaces/response-dto/ResponseUserDto";
import {UserUpdatePasswordDto} from "./interfaces/dto/UserUpdatePasswordDto";
import {UserSearchDto} from "./interfaces/dto/UserSearchDto";
import {UserUpdateDto} from "./interfaces/dto/UserUpdateDto";
import {MessagePattern} from "@nestjs/microservices";
import {MESSAGE_PATTERN} from "./interfaces/message-patterns.enum";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @MessagePattern(MESSAGE_PATTERN.USER_CREATE)
    public async createUser(dto: UserCreateDto): Promise<ResponseUserCreateDto> {
        return await this.userService.createUser(dto);

    }
    @MessagePattern(MESSAGE_PATTERN.GET_USER_BY_ID)
    public async searchUserByCredentials(dto: UserSearchDto): Promise<ResponseUserDto> {
        return await this.userService.searchUserByCredentials(dto);
    }
    @MessagePattern(MESSAGE_PATTERN.USER_SEARCH_BY_CREDENTIALS)
    public async searchUserById(id: string): Promise<ResponseUserDto> {
        return await this.userService.searchUserById(id);
    }
    @MessagePattern(MESSAGE_PATTERN.USER_UPDATE)
    public async updateUser(dto: UserUpdateDto): Promise<ResponseUserDto> {
        return await this.userService.updateUser(dto);
    }
    @MessagePattern(MESSAGE_PATTERN.USER_UPDATE)
    public async updatePassword(dto: UserUpdatePasswordDto): Promise<ResponseUserDto> {
        return await this.userService.updatePassword(dto);
    }

}
