import {HttpStatus, Injectable} from '@nestjs/common';
import {DeleteResult, Repository} from "typeorm";
import {IToken} from "../interfaces/token.interface";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {TokenEntity} from "../repository/token.entity";
import {ITokenResponse} from "../interfaces/token-response.interface";
import {Query} from "typeorm/driver/Query";
import {ITokenDestroyResponse} from "../interfaces/token-destroy-response";

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

    public async destroyToken(userId: string): Promise<ITokenDestroyResponse> {
        try {
            await this.tokenRepository.delete({ userId })
            return {
                status: HttpStatus.OK,
                message: 'token_destroy_success',
                errors: null,

            }
        } catch (e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'token_destroy_bad_request',
                errors: e.errors,
            }
        }
    }

    public async decodeToken(token: string): Promise<ITokenResponse> {
        const tokenModel = await this.tokenRepository.findOneBy({ token});
        if (tokenModel) {
            try {
                const tokenData = this.jwtService.decode(tokenModel.token) as {
                    exp: number;
                    userId: any;
                }

                if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
                  return {
                      status: HttpStatus.UNAUTHORIZED,
                      message: 'token_decode_unauthorized',
                      data: null
                  }
                } else {
                    return {
                        status: HttpStatus.OK,
                        message: 'token_decode_success',
                        data: tokenData.userId
                    }
                }
            } catch (e) {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'token_decode_unauthorized',
                    data: null
                };
            }
        }
    }
}
