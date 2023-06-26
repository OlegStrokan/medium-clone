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
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";
import {LogoutDto} from "../interfaces/auth/dto/logout.dto";
import {MessageMailerEnum} from "../interfaces/mailer/message-mailer.enum";
import {AuthLogsEnum} from "../interfaces/auth/auth-logs.enum";
import {IRole} from "../interfaces/role/IRole";
import {ISubscription} from "../interfaces/subscriptions/ISubscription";
import {LoginReturnDto} from "../interfaces/auth/response-dto/login-return.dto";
import {CreateTokenDto} from "../interfaces/token/dto/response-dto/create-token.dto";

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
            this.logger.log(AuthLogsEnum.REGISTRATION_SUCCESSFUL)

            return {
                status: userResponse.status,
                message: userResponse.message,
            }
        } else {
            this.logger.error(AuthLogsEnum.USER_CREATION_FAILED)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message)
        }
    }


    @Post("/login")
    public async login(@Body() dto: LoginDto): Promise<IGetItemResponse<LoginReturnDto> | GenericHttpException> {

        this.logger.log(AuthLogsEnum.LOGIN_INITIATED)
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_VALIDATE, JSON.stringify(dto))
        )
        if (userResponse.status !== HttpStatus.OK) {
            this.logger.error(AuthLogsEnum.INVALID_CREDENTIALS)
            throw new GenericHttpException<IError>(userResponse.status, userResponse.message);
        }

        this.logger.debug(AuthLogsEnum.USER_VALIDATION_COMPLETED)

        const tokenResponse: IGetItemServiceResponse<CreateTokenDto> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_CREATE, userResponse.data.id)
        )

        if (tokenResponse.status !== HttpStatus.CREATED) {
            this.logger.error(AuthLogsEnum.TOKEN_CREATION_FAILED)
            throw new GenericHttpException<IError>(tokenResponse.status, tokenResponse.message);
        }

        this.logger.debug(AuthLogsEnum.TOKEN_CREATION_COMPLETED)

        const roleResponse: IGetItemServiceResponse<IRole[]> = await firstValueFrom(
            this.roleServiceClient.send(MessageUserEnum.ROLE_GET_FOR_USER, JSON.stringify(userResponse.data.id))
        )
        if (roleResponse.status !== HttpStatus.OK) {
            this.logger.error(AuthLogsEnum.ROlE_RETRIEVAL_ERROR)
            throw new GenericHttpException<IError>(roleResponse.status, roleResponse.message);
        }

        this.logger.debug(AuthLogsEnum.ROLE_RETRIEVAL_SUCCESS)


        const subscriptionResponse: IGetItemServiceResponse<ISubscription[]> = await firstValueFrom(
            this.subscriptionServiceClient.send(MessageUserEnum.SUBSCRIPTION_GET_FOR_USER, JSON.stringify(userResponse.data.id))
        )
        if (subscriptionResponse.status !== HttpStatus.OK) {
            this.logger.error(AuthLogsEnum.SUBSCRIPTION_RETRIEVAL_ERROR)
            throw new GenericHttpException<IError>(subscriptionResponse.status, subscriptionResponse.message);
        }

        this.logger.debug(AuthLogsEnum.SUBSCRIPTION_RETRIEVAL_SUCCESS)

        this.logger.log(AuthLogsEnum.LOGIN_SUCCESSFUL)

        return {
            data: {
                user: userResponse.data,
                token: tokenResponse.data.value,
                roles: roleResponse.data,
                subscriptions: subscriptionResponse.data,
            },
            status: userResponse.status
        }

    }

    @Post("/logout")
    public async logout(@Body() dto: LogoutDto): Promise<IGetItemResponse<null> | GenericHttpException> {

        this.logger.log(AuthLogsEnum.LOGOUT_INITIATED)

        const tokenService: IGetItemServiceResponse<string> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_DESTROY, dto.id)
        )

        this.logger.debug(AuthLogsEnum.LOGOUT_SUCCESSFUL)

        if (tokenService.status !== HttpStatus.OK) {
            this.logger.error(AuthLogsEnum.LOGOUT_FAILED)
            throw new GenericHttpException<IError>(tokenService.status, tokenService.message);
        }

        return {
            data: null,
            status: tokenService.status,
            message: tokenService.message,
        }

    }

    @Get("/activate/:link")
    public async activate() {
        return 'hello'
    }


}

