import {CanActivate, ExecutionContext, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {firstValueFrom, Observable} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {IToken} from "../interfaces/token/IToken";
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject('token_service') private readonly tokenService: ClientProxy) {}

    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers['authorization']
        const tokenValue = headers.split(" ")[1];

        return this.validateUser(tokenValue);
    }

    private async validateUser(tokenValue: string): Promise<boolean> {

        const tokenServiceResponse: IGetItemServiceResponse<IToken> = await firstValueFrom(
            this.tokenService.send(MessageTokenEnum.TOKEN_DECODE, tokenValue),
        );

        console.log(tokenServiceResponse.status)

        return tokenServiceResponse.status === HttpStatus.OK;
    }
}
