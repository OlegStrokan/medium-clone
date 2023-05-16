import {
    Body,
    Controller, Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post
} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {MessagePatternEnum} from "../interfaces/user/message-pattern.enum";
import {IUser} from "../interfaces/user/IUser";
import {IGetItemResponse} from "../interfaces/user/response/IGetItemResponse";
import {IGetItemServiceResponse} from "../interfaces/user/service-response/IGetItemServiceResponse";
import {CreateUserDto} from "../interfaces/user/dto/create-user.dto";
import {GenericHttpException} from "../helpers/IGenericHttpException";
import {IError} from "../interfaces/user/IError";
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
            this.userServiceClient.send(MessagePatternEnum.USER_GET_BY_ID, id)
        )
        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data,
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, 'Not Found')
        } else {
            return new GenericHttpException<IError>(412, 'Precondition failed')
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetItemResponse<IUser[]> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser[]> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_GET, 'test')
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data
            }
        } else {
            return new GenericHttpException<IError>(412, 'Precondition failed')
        }

    }

    @Post("")
    public async createUser(@Body() dto: CreateUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_CREATE, dto)
        )

        if (userResponse.status === HttpStatus.CREATED) {
            return {
                data: userResponse.data,
            }
        } else if (userResponse.status === HttpStatus.CONFLICT) {
            return new GenericHttpException<IError>(409, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, 'Precondition failed')
        }
    }

    @Patch("")
    public async updateUser(@Body() dto: UpdateUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_UPDATE, dto)
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, 'Not Found')
        } else {
            return new GenericHttpException<IError>(412, 'Precondition failed')
        }
    }

    @Delete('/:id')
    public async deleteUser(@Param('id') id: string) {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessagePatternEnum.USER_DELETE, id)
        )

        if (userResponse.status === HttpStatus.NO_CONTENT) {
            return {
                data: userResponse.data
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, 'Not Found')
        } else {
            return new GenericHttpException<IError>(412, 'Precondition failed')
        }

    }
}
