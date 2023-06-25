import {CanActivate, ExecutionContext, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {firstValueFrom, Observable} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";
import {DecodeTokenDto} from "../interfaces/token/dto/response-dto/decode-token.dto";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject('token_service') private readonly tokenService: ClientProxy) {
    }

    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const headers = request.headers['authorization']
        const tokenValue = headers.split(" ")[1];

        return this.validateUser(tokenValue, request);
    }

    private async validateUser(tokenValue: string, request: any): Promise<boolean> {

        const tokenServiceResponse: IGetItemServiceResponse<DecodeTokenDto> = await firstValueFrom(
            this.tokenService.send(MessageTokenEnum.TOKEN_DECODE, tokenValue),
        );

        request.user = tokenServiceResponse.data.userId;
        return tokenServiceResponse.status === HttpStatus.OK
    }
}
