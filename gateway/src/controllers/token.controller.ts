import {Controller, HttpStatus, Inject } from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {firstValueFrom} from "rxjs";
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";
import {IGetItemResponse} from "../interfaces/IGetItemResponse";
import {GenericHttpException} from "../helpers/GenericHttpException";
import {IError} from "../interfaces/IError";
import {IToken} from "../interfaces/token/IToken";

@Controller("token")
export class TokenController {
    constructor(
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy
    ) {
    }

    public async createToken(userId: string): Promise<IGetItemResponse<IToken> | GenericHttpException> {
        const tokenServiceResponse: IGetItemServiceResponse<IToken> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_CREATE, userId)
        )

        if (tokenServiceResponse.status === HttpStatus.CREATED) {
            return {
                data: tokenServiceResponse.data
            }
        } else {
            return new GenericHttpException<IError>(412, tokenServiceResponse.message)
        }
    }

    public async destroyToken(token: string): Promise<IGetItemResponse<string> | GenericHttpException> {
        const tokenServiceResponse: IGetItemServiceResponse<string> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_DESTROY, token)
        )

        if (tokenServiceResponse.status === HttpStatus.OK) {
            return {
                data: tokenServiceResponse.data
            }
        } else {
            return new GenericHttpException<IError>(412, tokenServiceResponse.message)
        }

    }

    public async decodeToken(token: string) {
        const tokenServiceResponse: IGetItemServiceResponse<string> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_DECODE, token)
        )

        if (tokenServiceResponse.status === HttpStatus.OK) {
            return {
                data: tokenServiceResponse.data
            }
        }
        else if (tokenServiceResponse.status === HttpStatus.NOT_FOUND) {
            return new GenericHttpException<IError>(404, tokenServiceResponse.message)
        }

        else {
            return new GenericHttpException<IError>(412, tokenServiceResponse.message)
        }
    }
}
