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

@Controller("auth")
    export class AuthController {
    constructor(
        @Inject('user_service') private readonly userServiceClient: ClientProxy,
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy
    ) {}


        @Post("/registration")
        // TODO - change return value on create user on user microservice
        public async registration(@Body() dto: CreateUserDto): Promise<IGetItemResponse<string> | GenericHttpException> {
                const userResponse: IGetItemServiceResponse<string> = await firstValueFrom(
                this.userServiceClient.send(MessageUserEnum.USER_CREATE, dto)
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


        @Post("/login")
        public async login(@Body() dto: LoginDto): Promise<IGetItemResponse<IUser> > {
            const userResponse: IGetItemServiceResponse<IUser> = await firstValueFrom(
                this.userServiceClient.send(MessageUserEnum.USER_GET_BY_EMAIL, dto.email)
            )
        }

        @Post("/logout")
        public async logout() {

        }
}

