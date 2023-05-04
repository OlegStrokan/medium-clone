import {Controller, Get, Inject, Param, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {IGetUserResponse} from "../interfaces/user/IGetUserResponse";
import {IGetUsersResponse} from "../interfaces/user/IGetUsersResponse";


@Controller('users')
export class UsersController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy
    ) {}


    @Get('/:id')
    public async getUser(@Param('id') id: string): Promise<IGetUserResponse> {
        const userResponse: IGetUserResponse = await firstValueFrom(
            this.userServiceClient.send('get_user_by_id', id)
        )

        return {
            status: userResponse.status,
            message: userResponse.message,
            data: userResponse.data,
            errors: null
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetUsersResponse> {
        const userResponse: IGetUsersResponse = await firstValueFrom(
            this.userServiceClient.send('get_users', null)
        )

        return {
            status: userResponse.status,
            message: userResponse.message,
            data: userResponse.data,
            errors: null
        }
    }

}
