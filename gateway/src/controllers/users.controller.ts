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
import {Request} from "express";
import {ISubscription} from "../interfaces/subscriptions/ISubscription";
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthLogsEnum} from "../interfaces/auth/auth-logs.enum";
import {MessageMailerEnum} from "../interfaces/mailer/message-mailer.enum";
import {CreateUserSwaggerDto} from "../interfaces/user/swagger/create-user-swagger.dto";
import {DeleteUserSwaggerDto} from "../interfaces/user/swagger/delete-user-swagger.dto";
import {
    GetSubscriptionSwaggerDto
} from "../interfaces/user/swagger/get-subscription-swagger.dto";


@ApiTags("Users functional")
@Controller('users')
export class UsersController {
    private readonly logger: Logger;

    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
        @Inject('subscription_service') private readonly subscriptionServiceClient: ClientProxy,
        @Inject('role_service') private readonly roleServiceClient: ClientProxy,
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy,
        @Inject('mailer_service') private readonly mailerServiceClient: ClientProxy,

    ) {
        this.logger = new Logger(UsersController.name)

    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found', type: IUser })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: GenericHttpException })
    public async getUser(@Param('id') id: string): Promise<IGetItemResponse<IUser> | GenericHttpException> {

        const userResponse = await this.getUserById(id);

        if (userResponse.status !== HttpStatus.OK) {
            this.logger.log(UserLogsEnum.USERS_RETRIEVING_ERROR)
            throw new GenericHttpException(userResponse.status, userResponse.message)

        } return {

            data: userResponse.data,
            status: userResponse.status
        }
    }


    @Get('/')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Users found', type: [IUser] })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server errror',
        type: GenericHttpException })
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
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message)
        }

    }


    @Post("")
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, description: 'User found', type: CreateUserSwaggerDto })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: GenericHttpException })

    public async createUser(@Body() dto: CreateUserDto): Promise<IGetItemResponse<null> | GenericHttpException> {

        this.logger.log(UserLogsEnum.USER_CREATE_INITIATED)
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_CREATE, JSON.stringify(dto))
        )

        if (userResponse.status === HttpStatus.CREATED) {
            this.logger.debug(AuthLogsEnum.USER_CREATED)

            const roleResponse: IGetItemServiceResponse<null> = await firstValueFrom(
                this.roleServiceClient.send(
                    MessageUserEnum.ROLE_ASSIGN_TO_USER,
                    JSON.stringify({userId: userResponse.data.id, roleId: 2}),
                ),
            );

            if (roleResponse.status !== HttpStatus.CREATED) {
                this.logger.error(AuthLogsEnum.ROLE_ASSIGNMENT_ERROR)
                throw new GenericHttpException(roleResponse.status, roleResponse.message)
            }

            this.logger.debug(AuthLogsEnum.ROLE_ASSIGNMENT_SUCCESS)


            const subscriptionResponse: IGetItemServiceResponse<null> = await firstValueFrom(
                this.subscriptionServiceClient.send(
                    MessageUserEnum.SUBSCRIPTION_ASSIGN_TO_USER,
                    JSON.stringify({
                        userId: userResponse.data.id,
                        subscriptionId: 2,
                        subscribingUserId: userResponse.data.id
                    }),
                ),
            );


            if (subscriptionResponse.status !== HttpStatus.CREATED) {
                this.logger.error(AuthLogsEnum.SUBSCRIPTION_ASSIGNMENT_ERROR)
                throw new GenericHttpException(subscriptionResponse.status, subscriptionResponse.message)
            }

            this.logger.debug(AuthLogsEnum.SUBSCRIPTION_ASSIGNMENT_SUCCESS)


            const mailerResponse: IGetItemServiceResponse<string> = await firstValueFrom(
                this.mailerServiceClient.send(MessageMailerEnum.SEND_ACTIVATION_EMAIL, JSON.stringify({
                    email: dto.email,
                    activationLink: `http://localhost:8000/auth/activate/${userResponse.data.activationLink.link}`
                }))
            )

            if (mailerResponse.status !== HttpStatus.OK) {
                this.logger.error(AuthLogsEnum.ACTIVATION_EMAIL_FAILED)
                throw new GenericHttpException(subscriptionResponse.status, subscriptionResponse.message)
            }

            this.logger.debug(AuthLogsEnum.ACTIVATION_EMAIL_SENT)
            this.logger.log(UserLogsEnum.USER_CREATED_SUCCESS)

            return {
                status: userResponse.status,
                message: userResponse.message,
            }
        } else {
            this.logger.error(UserLogsEnum.USER_CREATED_ERROR)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message)
        }
    }

    @UseGuards(AuthGuard)
    @Patch("/:id")
    @ApiOperation({ summary: 'Update user' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User updated', type: IUser })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: GenericHttpException })

    public async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string, @Req() request): Promise<IGetItemResponse<IUser> | GenericHttpException> {

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
    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 204, description: 'User deleted', type:  DeleteUserSwaggerDto })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: GenericHttpException })

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
                status: userResponse.status,
                message: userResponse.message
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
    @ApiOperation({ summary: 'Get subscription for user' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Subscription found', type: GetSubscriptionSwaggerDto })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: GenericHttpException })

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
