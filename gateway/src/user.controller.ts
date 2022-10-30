import {Body, Controller, Get, HttpException, HttpStatus, Inject, Patch, Post, Put, Req} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IAuthorizedRequest} from "./interfaces/common/authorized-request.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IServiceUserCreateResponse} from "./interfaces/user/service-user-create-response.interface";
import {GetUserByIdResponseDto} from "./interfaces/user/dto/get-user-by-id-response.dto";
import {CreateUserDto} from "./interfaces/user/dto/create-user.dto";
import {CreateUserResponseDto} from "./interfaces/user/dto/create-user-response";
import {IServiceTokenCreateResponse} from "./interfaces/token/service-token-create-response.interface";
import {LoginUserDto} from "./interfaces/user/dto/login-user.dto";
import {LoginUserResponseDto} from "./interfaces/user/dto/login-user-response.dto";
import {LogoutUserResponseDto} from "./interfaces/user/dto/logout-user-response";
import {IServiceTokenDestroyResponse} from "./interfaces/token/service-token-destroy-response.interface";
import {UpdateUserDto} from "./interfaces/user/dto/update-user.dto";
import {IServiceUserUpdateResponse} from "./interfaces/user/service-user-update-response.interface";
import {UpdateUserResponseDto} from "./interfaces/user/dto/update-user-response";
import {IServiceUserSearchResponse} from "./interfaces/user/service-user-search-response.interface";

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        @Inject(SERVICE.TOKEN) private readonly tokenService: ClientProxy,
        @Inject(SERVICE.USER) private readonly userService: ClientProxy,
    ) {
    }


    @Get()
    public async getUserById(@Req() request: IAuthorizedRequest): Promise<GetUserByIdResponseDto> {
        const userInfo = request.user;

        const userResponse: IServiceUserSearchResponse = await firstValueFrom(
            this.userService.send(MESSAGE_PATTERN.GET_USER_BY_ID, userInfo.id)
        );

        return {
            message: userResponse.message,
            data: {
                user: userResponse.data,
            },
            errors: null
        }
    }


    @Post()
    public async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponseDto> {
        const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
            this.userService.send(MESSAGE_PATTERN.USER_CREATE, dto)
        )

        if (createUserResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(
                {
                    message: createUserResponse.message,
                    data: null,
                    errors: createUserResponse.errors
                },
                createUserResponse.status
            )
        }

        const createTokenResponse: IServiceTokenCreateResponse = await firstValueFrom(
            this.tokenService.send(MESSAGE_PATTERN.TOKEN_CREATE, {userId: createUserResponse.data.id})
        )

        return {
            message: createUserResponse.message,
            data: {
                user: createUserResponse.data,
                token: createTokenResponse.token
            },
            errors: null
        }

    }

    @Patch()
    public async updateUser(@Body() dto: UpdateUserDto): Promise<UpdateUserResponseDto> {
        const createUserResponse: IServiceUserUpdateResponse = await firstValueFrom(
            this.userService.send(MESSAGE_PATTERN.USER_UPDATE, dto)
        )

        if (createUserResponse.status !== HttpStatus.OK) {
            throw new HttpException({
                message: createUserResponse.message,
                data: null,
                errors: null
            }, createUserResponse.status)
        }

        return {
            message: createUserResponse.message,
            data: createUserResponse.data,
            errors: null
        }
    }

    @Post('/login')
    public async loginUser(@Body() dto: LoginUserDto): Promise<LoginUserResponseDto> {
        const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
            this.userService.send(MESSAGE_PATTERN.USER_SEARCH_BY_CREDENTIALS, dto)
        )

        if (getUserResponse.status !== HttpStatus.OK) {
            throw new HttpException({
                message: getUserResponse.message,
                data: null,
                errors: null
            }, HttpStatus.UNAUTHORIZED)
        }

        const createTokenResponse: IServiceTokenCreateResponse = await firstValueFrom(
            this.tokenService.send(MESSAGE_PATTERN.TOKEN_CREATE, getUserResponse.data.id)
        )

        return {
            message: createTokenResponse.message,
            data: {
                token: createTokenResponse.token
            },
            errors: null
        }
    }

    @Put('/logout')
    public async logoutUser(@Req() dto: IAuthorizedRequest): Promise<LogoutUserResponseDto> {
        const userInfo = dto.user;
        const destroyTokenResponse: IServiceTokenDestroyResponse = await firstValueFrom(
            this.tokenService.send(MESSAGE_PATTERN.TOKEN_DESTROY, {userId: userInfo.id})
        )

        if (destroyTokenResponse.status !== HttpStatus.OK) {
            throw new HttpException({
                message: destroyTokenResponse.message,
                data: null,
                errors: destroyTokenResponse.errors
            }, destroyTokenResponse.status)
        }
        return {
            message: destroyTokenResponse.message,
            data: null,
            errors: null
        }


    }
}
