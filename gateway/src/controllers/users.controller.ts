import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    Inject, Logger,
    Param,
    Patch,
    Post, UseGuards
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
import {DeleteUserDto} from "../interfaces/user/dto/delete-user.dto";
import {AuthGuard} from "../helpers/auth.guard";
import {UserLogsEnum} from "../interfaces/user/user-logs.enum";


@Controller('users')
export class UsersController {
    private readonly logger: Logger;
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
    ) {
        this.logger = new Logger(UsersController.name)

    }

    @Get('/:id')
    public async getUser(@Param('id') id: number): Promise<IGetItemResponse<IUser> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET_BY_ID, id)
        )
        if (userResponse.status === HttpStatus.OK) {
            this.logger.log(UserLogsEnum.USER_RETRIEVED_SUCCESS)
            return {
                data: userResponse.data,
                status: userResponse.status,
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            this.logger.log(UserLogsEnum.USER_NOT_FOUND)
            throw new GenericHttpException<IError>(404, userResponse.message)
        } else {
            this.logger.log(UserLogsEnum.USER_RETRIEVING_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @Get("")
    public async getUsers(): Promise<IGetItemResponse<IUser[]> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USERS_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser[]> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET, 'test')
        )

        if (userResponse.status === HttpStatus.OK) {
            this.logger.log(UserLogsEnum.USERS_RETRIEVED_SUCCESS)
            return {
                data: userResponse.data,
                status: userResponse.status
            }
        } else {
            this.logger.log(UserLogsEnum.USERS_RETRIEVING_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }

    }

    @Post("")
    public async createUser(@Body() dto: CreateUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {


        this.logger.log(UserLogsEnum.USER_CREATE_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_CREATE, JSON.stringify(dto))
        )

        if (userResponse.status === HttpStatus.CREATED) {
            this.logger.log(UserLogsEnum.USER_CREATED_SUCCESS)
            return {
                data: userResponse.data,
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.CONFLICT) {
            this.logger.log(UserLogsEnum.USER_CREATED_CONFLICT)
            throw new GenericHttpException<IError>(409, userResponse.message)
        } else {
            this.logger.log(UserLogsEnum.USER_CREATED_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @UseGuards(AuthGuard)
    @Patch("/:id")
    public async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: DeleteUserDto): Promise<IGetItemResponse<IUser> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_UPDATE_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_UPDATE, JSON.stringify({id, ...dto}))
        )

        if (userResponse.status === HttpStatus.OK) {
            this.logger.log(UserLogsEnum.USER_UPDATED_SUCCESS)
            return {
                data: userResponse.data,
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            this.logger.log(UserLogsEnum.USER_UPDATED_NOT_FOUND)
            throw new GenericHttpException<IError>(404, userResponse.message)
        } else {
            this.logger.log(UserLogsEnum.USER_UPDATED_FAILED)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @Delete('/:id')
    public async deleteUser(@Param('id') id: DeleteUserDto): Promise<IGetItemResponse<string> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_DELETED_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_DELETE, id)
        )

        if (userResponse.status === HttpStatus.NO_CONTENT) {
            this.logger.log(UserLogsEnum.USER_DELETED_SUCCESS)
            return {
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            this.logger.log(UserLogsEnum.USER_DELETED_NOT_FOUND)
            throw new GenericHttpException<IError>(404, userResponse.message)
        } else {
            this.logger.log(UserLogsEnum.USER_DELETED_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }

    }
}
