import {Body, Controller, Get, HttpStatus, Inject, Logger, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserDto} from "../interfaces/user/dto/create-user.dto";
import {IGetItemResponse} from "../interfaces/IGetItemResponse";
import {IUser} from "../interfaces/user/IUser";
import {GenericHttpException} from "../helpers/GenericHttpException";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {firstValueFrom} from "rxjs";
import {MessageUserEnum} from "../interfaces/user/message-user.enum";
import {IError} from "../interfaces/IError";
import {LoginDto} from "../interfaces/auth/dto/login.dto";
import {IToken} from "../interfaces/token/IToken";
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";
import {LogoutDto} from "../interfaces/auth/dto/logout.dto";
import * as uuid from 'uuid'
import {MessageMailerEnum} from "../interfaces/mailer/message-mailer.enum";
import {AuthLogsEnum} from "../interfaces/auth/auth-logs.enum";
import {IRole} from "../interfaces/role/IRole";

@Controller("auth")
export class AuthController {
    private readonly logger: Logger;

    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy,
        @Inject('mailer_service') private readonly mailerServiceClient: ClientProxy,
        @Inject('role_service') private readonly roleServiceClient: ClientProxy,
        @Inject('subscription_service') private readonly subscriptionServiceClient: ClientProxy,
    ) {
        this.logger = new Logger(AuthController.name)
    }

    @Post("registration")
    public async registration(@Body() dto: CreateUserDto): Promise<IGetItemResponse<string> | GenericHttpException> {

        this.logger.log(AuthLogsEnum.REGISTRATION_INITIATED)
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_CREATE, JSON.stringify(dto))
        )

        if (userResponse.status === HttpStatus.CREATED) {
            this.logger.debug(AuthLogsEnum.USER_CREATED)


            const roleServiceResponse: IGetItemResponse<IRole> = await firstValueFrom(
                this.roleServiceClient.send(MessageUserEnum.ROLE_GET_BY_VALUE, 'admin'),
            );


            await firstValueFrom(
                this.roleServiceClient.send(
                    MessageUserEnum.ROLE_ASSIGN_TO_USER,
                    JSON.stringify({userId: userResponse.data.id, roleId: roleServiceResponse.data.id}),
                ),
            );


            const mailerResponse: IGetItemServiceResponse<string> = await firstValueFrom(
                this.mailerServiceClient.send(MessageMailerEnum.SEND_ACTIVATION_EMAIL, JSON.stringify({
                    email: dto.email,
                    activationLink: `http://localhost:8000/auth/activate/${userResponse.data.activationLink.link}`
                }))
            )

            if (mailerResponse.status === HttpStatus.OK) {

                this.logger.debug(AuthLogsEnum.ACTIVATION_EMAIL_SENT)
                this.logger.log(AuthLogsEnum.REGISTRATION_SUCCESSFUL)

                return {
                    status: userResponse.status,
                    message: userResponse.message,
                }
            } else {
                this.logger.log(AuthLogsEnum.ACTIVATION_EMAIL_FAILED)
                throw new GenericHttpException<IError>(mailerResponse.status, mailerResponse.message)
            }


        } else {
            this.logger.log(AuthLogsEnum.USER_CREATION_FAILED)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message)
        }
    }


    @Post("/login")
    public async login(@Body() dto: LoginDto): Promise<IGetItemResponse<IUser & { token: string }> | GenericHttpException> {

        this.logger.log(AuthLogsEnum.LOGIN_INITIATED)
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_VALIDATE, JSON.stringify(dto))
        )

        this.logger.debug(AuthLogsEnum.USER_VALIDATION_COMPLETED)

        if (userResponse.status !== HttpStatus.OK) {
            this.logger.log(AuthLogsEnum.INVALID_CREDENTIALS)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message);
        }

        const tokenResponse: IGetItemServiceResponse<IToken> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_CREATE, userResponse.data.id)
        )

        this.logger.debug(AuthLogsEnum.TOKEN_CREATION_COMPLETED)

        if (tokenResponse.status !== HttpStatus.CREATED) {
            this.logger.log(AuthLogsEnum.TOKEN_CREATION_FAILED)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message);
        }

        this.logger.log(AuthLogsEnum.LOGIN_SUCCESSFUL)

        return {
            data: {
                ...userResponse.data,
                token: tokenResponse.data.value
            },
            status: userResponse.status
        }

    }

    @Post("/logout")
    public async logout(@Body() dto: LogoutDto): Promise<IGetItemResponse<string> | GenericHttpException> {

        this.logger.log(AuthLogsEnum.LOGOUT_INITIATED)

        const userResponse: IGetItemServiceResponse<string> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_DESTROY, dto.id)
        )

        this.logger.debug(AuthLogsEnum.LOGOUT_SUCCESSFUL)

        if (userResponse.status !== HttpStatus.OK) {
            this.logger.debug(AuthLogsEnum.LOGOUT_FAILED)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message);
        }

        return {
            data: userResponse.data,
            status: userResponse.status
        }

    }

    @Get("/activate/:link")
    public async activate() {
        return 'hello'
    }


}

