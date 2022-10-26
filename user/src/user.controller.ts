import {Controller, Inject, Post} from '@nestjs/common';
import {UserService} from './services/user.service';
import {ClientProxy} from "@nestjs/microservices";
import {IUserCreateResponse} from "./interfaces/user-create-response.interface";
import {IUserCreate} from "./interfaces/user-create.interface";
import {IUserSearch} from "./interfaces/user-search.interface";
import {IUserSearchResponse} from "./interfaces/user-search-response.interface";
import {IUserUpdate} from "./interfaces/user-update.interface";
import {IUserUpdatePassword} from "./interfaces/user-update-password.interface";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy
    ) {
    }

    public async createUser(dto: IUserCreate): Promise<IUserCreateResponse> {
        return this.userService.createUser(dto);

    }

    public async searchUserByCredentials(dto: IUserSearch): Promise<IUserSearchResponse> {
        return this.userService.searchUserByCredentials(dto);
    }

    public async searchUserById(id: string): Promise<IUserSearchResponse> {
        return this.userService.searchUserById(id);
    }

    public async updateUser(dto: IUserUpdate): Promise<IUserSearchResponse> {
        return this.userService.updateUser(dto);
    }

    public async updatePassword(dto: IUserUpdatePassword): Promise<IUserSearchResponse> {
        return this.userService.updatePassword(dto);
    }

}
