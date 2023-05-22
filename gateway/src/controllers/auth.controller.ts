import {Body, Controller, HttpStatus, Inject, Post} from "@nestjs/common";
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

@Controller("auth")
export class AuthController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy
    ) {
    }


    @Post("/registration")
    // TODO - change return value on create user on user microservice
    public async registration(@Body() dto: CreateUserDto): Promise<IGetItemResponse<string> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<string> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_CREATE, dto)
        )

        if (userResponse.status === HttpStatus.CREATED) {
            return {
                messages: userResponse.message
            }
        } else if (userResponse.status === HttpStatus.CONFLICT) {
            return new GenericHttpException<IError>(409, userResponse.message)
        } else {
            return new GenericHttpException<IError>(412, userResponse.message)
        }
    }


    @Post("/login")
    public async login(@Body() dto: LoginDto): Promise<IGetItemResponse<IUser & IToken> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
            this.userServiceClient.send(MessageUserEnum.USER_GET_BY_EMAIL, dto.email)
        )

        if (userResponse.status !== HttpStatus.OK) {
            return new GenericHttpException<IError>(401, userResponse.message)
        }

        const tokenResponse: IGetItemServiceResponse<IToken> = await firstValueFrom(
            this.userServiceClient.send(MessageTokenEnum.TOKEN_CREATE, userResponse.data.id)
        )

        return {
            data: {
                ...userResponse.data,
                ...tokenResponse.data
            }
        }

    }

    @Post("/logout")
    public async logout(@Body() id: string): Promise<IGetItemResponse<string> | GenericHttpException> {
        const userResponse: IGetItemServiceResponse<string> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_DESTROY, id)
        )

        if (userResponse.status === HttpStatus.OK) {
            return {
                data: userResponse.data,
            }
        } else {
            return new GenericHttpException<IError>(412, userResponse.message);
        }


    }
}

