import {Body, Controller, Get, HttpException, HttpStatus, Inject, Patch, Post, Put, Req} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IAuthorizedRequest} from "./interfaces/common/authorized-request.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IServiceUserCreate} from "./interfaces/user/IServiceUserCreate";
import {ResponseUserGetByIdDto} from "./interfaces/user/dto/response/ResponseUserGetByIdDto";
import {UserCreateDto} from "./interfaces/user/dto/UserCreateDto";
import {CreateUserResponseDto} from "./interfaces/user/dto/response/ResponseUserCreateDto";
import {IServiceTokenCreateResponse} from "./interfaces/token/service-token-create-response.interface";
import {UserLoginDto} from "./interfaces/user/dto/UserLoginDto";
import {ResponseUserLoginDto} from "./interfaces/user/dto/response/ResponseUserLoginDto";
import {ResponseUserLogoutDto} from "./interfaces/user/dto/response/ResponseUserLogoutDto";
import {IServiceTokenDestroyResponse} from "./interfaces/token/service-token-destroy-response.interface";
import {UserUpdateDto} from "./interfaces/user/dto/UserUpdateDto";
import {IServiceUserUpdate} from "./interfaces/user/IServiceUserUpdate";
import {ResponseUserUpdateDto} from "./interfaces/user/dto/response/ResponseUserUpdateDto";
import {IServiceUserSearch} from "./interfaces/user/IServiceUserSearch";

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        @Inject(SERVICE.TOKEN) private readonly tokenService: ClientProxy,
        @Inject(SERVICE.USER) private readonly userService: ClientProxy,
    ) {
    }


    @Get()
    public async getUserById(@Req() request: IAuthorizedRequest): Promise<ResponseUserGetByIdDto> {
        const userInfo = request.user;

        const userResponse: IServiceUserSearch = await firstValueFrom(
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
    public async createUser(@Body() dto: UserCreateDto): Promise<CreateUserResponseDto> {
        const createUserResponse: IServiceUserCreate = await firstValueFrom(
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
    public async updateUser(@Body() dto: UserUpdateDto): Promise<ResponseUserUpdateDto> {
        const createUserResponse: IServiceUserUpdate = await firstValueFrom(
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
    public async loginUser(@Body() dto: UserLoginDto): Promise<ResponseUserLoginDto> {
        const getUserResponse: IServiceUserSearch = await firstValueFrom(
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
    public async logoutUser(@Req() dto: IAuthorizedRequest): Promise<ResponseUserLogoutDto> {
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
