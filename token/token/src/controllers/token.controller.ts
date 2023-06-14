import {Controller, Get} from '@nestjs/common';
import {TokenService} from '../services/token.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "../interfaces/message-enums/message-pattern.enum";
import {ResponseTokenDto} from "../interfaces/response-dtos.ts/response-token.dto";
import {IToken} from "../interfaces/IToken";

@Controller()
export class TokenController {
    constructor(private readonly tokenService: TokenService) {
    }

    @MessagePattern(MessagePatternEnum.TOKEN_CREATE)
    async createToken(userId: string): Promise<ResponseTokenDto<IToken>> {
        return await this.tokenService.createToken(userId);
    }

    @MessagePattern(MessagePatternEnum.TOKEN_DESTROY)
    async destroyToken(userId: string): Promise<ResponseTokenDto<string>> {
        return await this.tokenService.destroyToken(userId);
    }

    @MessagePattern(MessagePatternEnum.TOKEN_DECODE)
    async decodeToken(token: string): Promise<ResponseTokenDto<string>> {
        return await this.tokenService.decodeToken(token);
    }


}
