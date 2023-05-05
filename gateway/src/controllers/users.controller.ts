import {Body, Controller, Get, Inject, Param, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {MessagePatternEnum} from "../interfaces/user/message-pattern.enum";
import {IUser} from "../interfaces/user/IUser";
import {IGetItemResponse} from "../interfaces/user/response/IGetItemResponse";
import {IGetItemServiceResponse} from "../interfaces/user/service-response/IGetItemServiceResponse";
import {CreateUserDto} from "../interfaces/user/dto/create-user.dto";


@Controller('users')
export class UsersController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy
    ) {}


    @Get('/:id')
    public async getUser(@Param('id') id: string): Promise<IGetItemResponse<IUser>> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_GET_BY_ID, id)
        )
            console.log(userResponse)
        return {
            data: userResponse.data,
            errors: userResponse.errors
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetItemResponse<IUser[]>> {
        const userResponse: IGetItemServiceResponse<IUser[]> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_GET, 'test')
        )
        console.log(userResponse)

        return {
            data: userResponse.data,
            errors: userResponse.errors
        }
    }

    @Post("")
    public async createUser(@Body() dto: CreateUserDto): Promise<IGetItemResponse<IUser>> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_CREATE, dto)
        )

        return {
            data: userResponse.data,
            errors: userResponse.errors
        }
    }

}
