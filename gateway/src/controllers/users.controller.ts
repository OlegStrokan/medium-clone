import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Logger,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
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
import {AuthGuard} from "../helpers/auth.guard";
import {UserLogsEnum} from "../interfaces/user/user-logs.enum";
import {IRole} from "../interfaces/role/IRole";
import {Request} from "express";
import {ISubscription} from "../interfaces/subscriptions/ISubscription";
import {MessageSubscriptionEnum} from "../interfaces/subscriptions/message-subscription.enum";



@Controller('users')
export class UsersController {
    private readonly logger: Logger;

    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
        @Inject('subscription_service') private readonly subscriptionServiceClient: ClientProxy,
        @Inject('role_service') private readonly roleServiceClient: ClientProxy,
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy,
    ) {
        this.logger = new Logger(UsersController.name)

    }

    @Get('/:id')
    public async getUser(@Param('id') id: string): Promise<IGetItemResponse<IUser> | GenericHttpException> {

        const userResponse = await this.getUserById(id);

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data,
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            this.logger.log(UserLogsEnum.USER_NOT_FOUND)
            throw new GenericHttpException(404, userResponse.message)
        } else {
            this.logger.log(UserLogsEnum.USER_RETRIEVING_ERROR)
            throw new GenericHttpException(412, userResponse.message)
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


            const roleServiceResponse: IGetItemResponse<IRole> = await firstValueFrom(
                this.roleServiceClient.send(MessageUserEnum.ROLE_GET_BY_VALUE, 'admin'),
            );


            await firstValueFrom(
                this.roleServiceClient.send(
                    MessageUserEnum.ROLE_ASSIGN_TO_USER,
                    JSON.stringify({userId: userResponse.data.id, roleId: roleServiceResponse.data.id}),
                ),
            );

            return {
                data: userResponse.data,
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.CONFLICT) {
            this.logger.log(UserLogsEnum.USER_CREATED_CONFLICT)
            throw new GenericHttpException<IError>(409, userResponse.message)
        } else {
            this.logger.error(UserLogsEnum.USER_CREATED_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @UseGuards(AuthGuard)
    @Patch("/:id")
    public async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string, @Req() request: Request &  { user: any }): Promise<IGetItemResponse<IUser> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_UPDATE_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_UPDATE, JSON.stringify({
                id: +id,
                ...dto,
                updatingUserId: request.user
            }))
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
            this.logger.error(UserLogsEnum.USER_UPDATED_FAILED)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    public async deleteUser(@Param('id') id: string, @Req() request): Promise<IGetItemResponse<string> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_DELETED_INITIATED)


        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_DELETE, JSON.stringify({
                id,
                deletingUserId: request.user
            }))
        )

        if (userResponse.status === HttpStatus.NO_CONTENT) {
            this.logger.log(UserLogsEnum.USER_DELETED_SUCCESS)
            return {
                status: userResponse.status
            }
        } else if (userResponse.status === HttpStatus.NOT_FOUND) {
            this.logger.log(UserLogsEnum.USER_DELETED_NOT_FOUND)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message)
        } else {
            this.logger.error(UserLogsEnum.USER_DELETED_ERROR)
            throw new GenericHttpException<IError>(412, userResponse.message)
        }

    }


    @UseGuards(AuthGuard)
    @Get('/:id/subscriptions')
    public async getSubscriptionsForUser(@Param('id') id: string, @Req() request): Promise<IGetItemResponse<ISubscription[]> | GenericHttpException> {

        const subscriptionResponse: IGetItemServiceResponse<ISubscription[]> = await firstValueFrom(
            this.subscriptionServiceClient.send(MessageUserEnum.SUBSCRIPTION_GET_FOR_USER,
                JSON.stringify({
                    userId: +id,
                    subscribingUserId: request.user
                }))
        )

        if (subscriptionResponse.status !== HttpStatus.OK) {
            throw new GenericHttpException<IError>(subscriptionResponse.status, subscriptionResponse.message)
        }

        return {
            data: subscriptionResponse.data,
            status: subscriptionResponse.status
        }

    }



    private async getUserById(id: string): Promise<IGetItemResponse<IUser>> {

        this.logger.log(UserLogsEnum.USER_INITIATED)

        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET_BY_ID, id)
        )

        if (userResponse.status === HttpStatus.OK) {

            return {
                data: userResponse.data,
                status: userResponse.status


            }
        } else {
                return {
                    data:  userResponse.data,
                    status: userResponse.status
                }
            }
        }
}
