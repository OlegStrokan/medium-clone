import {HttpStatus, Injectable} from '@nestjs/common';
import {DeleteResult, Repository} from "typeorm";
import {IToken} from "../interfaces/token.interface";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {TokenEntity} from "../repository/token.entity";
import {ITokenResponse} from "../interfaces/token-response.interface";
import {Query} from "typeorm/driver/Query";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>
    ) {
    }

    public async createToken(userId: string): Promise<ITokenResponse> {
        try {
            const tokenValue = this.jwtService.sign({userId})
            await this.tokenRepository.save({userId, token: tokenValue})
            return {
                status: HttpStatus.CREATED,
                message: 'create_token_success',
                data: tokenValue
            };

        } catch (e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'create_token_bad_request',
                data: null,
            }
        }
    }

    public async deleteTokenForUserId(userId: string): Promise<DeleteResult> {
        return this.tokenRepository.delete({ userId })
    }

    public async decodeToken(token: string): Promise<{ userId: string }> {
        const tokenModel = await this.tokenRepository.findOneBy({ token});
        if (tokenModel) {
            try {
                const tokenData = this.jwtService.decode(tokenModel.token) as {
                    exp: number;
                    userId: any;
                }

                if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
                  return null
                } else {
                    return {
                        userId: tokenData.userId
                    }
                }
            } catch (e) {
                return null;
            }
        }
    }
}
