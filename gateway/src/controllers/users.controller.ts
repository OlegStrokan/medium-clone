import {Body, Controller, Get, HttpException, HttpStatus, Inject, NotFoundException, Param, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {MessagePatternEnum} from "../interfaces/user/message-pattern.enum";
import {IUser} from "../interfaces/user/IUser";
import {IGetItemResponse} from "../interfaces/user/response/IGetItemResponse";
import {IGetItemServiceResponse} from "../interfaces/user/service-response/IGetItemServiceResponse";
import {CreateUserDto} from "../interfaces/user/dto/create-user.dto";
import {GenericHttpException} from "../helpers/IGenericHttpException";
import {IError} from "../interfaces/user/IError";


@Controller('users')
export class UsersController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy
    ) {}

    @Get('/:id')
    public async getUser(@Param('id') id: number): Promise<IGetItemResponse<IUser>> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_GET_BY_ID, id)
        )
        return {
            data: userResponse.data,
            errors: userResponse.errors
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetItemResponse<IUser[]> | GenericHttpException<IError>> {
        const userResponse: IGetItemServiceResponse<IUser[]> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_GET, 'test')
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data,
                errors: null
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, 'Not Found')
        }

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
