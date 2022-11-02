import {Controller, Inject, Post} from '@nestjs/common';
import {UserService} from './services/user.service';
import {ClientProxy} from "@nestjs/microservices";
import {IUserCreateResponse} from "./interfaces/IUserCreateResponse";
import {UserCreateDto} from "./interfaces/dto/UserCreateDto";
import {IUserResponse} from "./interfaces/IUserResponse";
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

    public async createUser(dto: UserCreateDto): Promise<IUserCreateResponse> {
        return this.userService.createUser(dto);

    }

    public async searchUserByCredentials(dto: UserSearchDto): Promise<IUserResponse> {
        return this.userService.searchUserByCredentials(dto);
    }

    public async searchUserById(id: string): Promise<IUserResponse> {
        return this.userService.searchUserById(id);
    }

    public async updateUser(dto: UserUpdateDto): Promise<IUserResponse> {
        return this.userService.updateUser(dto);
    }

    public async updatePassword(dto: UserUpdatePasswordDto): Promise<IUserResponse> {
        return this.userService.updatePassword(dto);
    }

}
