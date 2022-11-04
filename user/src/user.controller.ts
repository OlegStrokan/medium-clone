import {Controller, Inject, Post} from '@nestjs/common';
import {UserService} from './services/user.service';
import {ClientProxy} from "@nestjs/microservices";
import {ResponseUserCreateDto} from "./interfaces/response-dto/ResponseUserCreateDto";
import {UserCreateDto} from "./interfaces/dto/UserCreateDto";
import {ResponseUserDto} from "./interfaces/response-dto/ResponseUserDto";
import {UserUpdatePasswordDto} from "./interfaces/dto/UserUpdatePasswordDto";
import {UserSearchDto} from "./interfaces/dto/UserSearchDto";
import {UserUpdateDto} from "./interfaces/dto/UserUpdateDto";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy
    ) {
    }

    public async createUser(dto: UserCreateDto): Promise<ResponseUserCreateDto> {
        return this.userService.createUser(dto);

    }

    public async searchUserByCredentials(dto: UserSearchDto): Promise<ResponseUserDto> {
        return this.userService.searchUserByCredentials(dto);
    }

    public async searchUserById(id: string): Promise<ResponseUserDto> {
        return this.userService.searchUserById(id);
    }

    public async updateUser(dto: UserUpdateDto): Promise<ResponseUserDto> {
        return this.userService.updateUser(dto);
    }

    public async updatePassword(dto: UserUpdatePasswordDto): Promise<ResponseUserDto> {
        return this.userService.updatePassword(dto);
    }

}
