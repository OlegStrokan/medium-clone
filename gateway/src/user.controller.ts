import {Controller, Get, Inject, Req} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {SERVICE} from "./interfaces/common/enum/microservices.enum";
import {ClientProxy} from "@nestjs/microservices";
import {IAuthorizedRequest} from "./interfaces/common/authorized-request.interface";
import {firstValueFrom} from "rxjs";
import {MESSAGE_PATTERN} from "./interfaces/common/enum/message-patterns.enum";
import {IServiceUserCreateResponse} from "./interfaces/user/service-user-create-response.interface";

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        @Inject(SERVICE.TOKEN) private readonly tokenService: ClientProxy,
        @Inject(SERVICE.USER) private readonly userService: ClientProxy,
    ) {
    }


    public async getUserById(@Req() request: IAuthorizedRequest): Promise<any> {
        const userInfo = request.user;

        const userResponse: IServiceUserCreateResponse = await firstValueFrom(
            this.userService.send(MESSAGE_PATTERN.GET_USER_BY_ID, userInfo.id)
        );

        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null
        }
    }

}
