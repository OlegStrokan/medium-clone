import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post
} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {MessageUserEnum} from "../interfaces/user/message-user.enum";
import {IUser} from "../interfaces/user/IUser";
import {IGetItemResponse} from "../interfaces/IGetItemResponse";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {CreateUserDto} from "../interfaces/user/dto/create-user.dto";
import {GenericHttpException} from "../helpers/GenericHttpException";
import {IError} from "../interfaces/IError";
import {UpdateUserDto} from "../interfaces/user/dto/update-user.dto";


@Controller('users')
export class UsersController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy
    ) {
    }

    @Get('/:id')
    public async getUser(@Param('id') id: number): Promise<IGetItemResponse<IUser> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET_BY_ID, id)
        )
        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data,
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetItemResponse<IUser[]> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser[]> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET, 'test')
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data
            }
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }

    }

    @Post("")
    public async createUser(@Body() dto: CreateUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_CREATE, dto)
        )

        if (userResponse.status === HttpStatus.CREATED) {
            return {
                data: userResponse.data,
            }
        } else if (userResponse.status === HttpStatus.CONFLICT) {
            return new GenericHttpException<IError>(409, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @Patch("")
    public async updateUser(@Body() dto: UpdateUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_UPDATE, dto)
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @Delete('/:id')
    public async deleteUser(@Param('id') id: string) {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_DELETE, id)
        )

        if (userResponse.status === HttpStatus.NO_CONTENT) {
            return {
                data: userResponse.data
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }

    }
}
