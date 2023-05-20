import {Controller, HttpStatus, Inject, Post} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {IGetItemServiceResponse} from "../interfaces/IGetItemServiceResponse";
import {AST} from "eslint";
import Token = AST.Token;
import {firstValueFrom} from "rxjs";
import {MessageTokenEnum} from "../interfaces/token/message-token.enum";
import {IGetItemResponse} from "../interfaces/IGetItemResponse";
import {GenericHttpException} from "../helpers/GenericHttpException";
import {IError} from "../interfaces/IError";

@Controller("token")
export class TokenController {
    constructor(
        @Inject('token_service') private readonly tokenServiceClient: ClientProxy
    ) {
    }

    public async createToken(userId: string): Promise<IGetItemResponse<Token> | GenericHttpException> {
        const tokenServiceResponse: IGetItemServiceResponse<Token> = await firstValueFrom(
            this.tokenServiceClient.send(MessageTokenEnum.TOKEN_CREATE, userId)
        )

        if (tokenServiceResponse.status === HttpStatus.CREATED) {
            return {
                data: tokenServiceResponse.data
            }
        } else {
            return new GenericHttpException<IError>(412, 'Precondition Failed')
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
            return new GenericHttpException<IError>(412, 'Precondition Failed')
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
            return new GenericHttpException<IError>(404, 'Not Found')
        }

        else {
            return new GenericHttpException<IError>(412, 'Precondition Failed')
        }
    }
}
