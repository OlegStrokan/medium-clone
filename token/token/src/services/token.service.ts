import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {TokenEntity} from "../repository/token.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {IToken} from "../interfaces/IToken";
import {JwtService} from "@nestjs/jwt";
import {ResponseTokenDto} from "../interfaces/response-dtos.ts/response-token.dto";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {TokenLogsEnum} from "../interfaces/message-enums/token-logs.enum";

@Injectable()
export class TokenService {
    private readonly logger: Logger

    constructor(
        @InjectRepository(TokenEntity)
        public readonly tokenRepository: Repository<IToken>,
        private readonly jwtService: JwtService,
    ) {
        this.logger = new Logger(TokenService.name)
    }

    public async createToken(userId: string): Promise<ResponseTokenDto<IToken>> {

        this.logger.log(TokenLogsEnum.TOKEN_CREATION_INITIATED)
        try {
            const tokenValue = this.generateToken(userId);

            const token = await this.tokenRepository.create({userId: userId, value: tokenValue})
            await this.tokenRepository.save(token)
            this.logger.log(TokenLogsEnum.TOKEN_CREATION_SUCCESS)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: token,
            }
        } catch (e) {
            this.logger.log(TokenLogsEnum.TOKEN_CREATION_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async destroyToken(userId: string): Promise<ResponseTokenDto<string>> {

        this.logger.log(TokenLogsEnum.TOKEN_DESTRUCTION_INITIATED)
        try {
            const deleteResult = await this.tokenRepository.delete({userId});

            if (deleteResult.affected === 0) {

                this.logger.log(TokenLogsEnum.TOKEN_DESTRUCTION_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null,
                }
            }

            this.logger.log(TokenLogsEnum.TOKEN_DESTRUCTION_SUCCESS)

            return {
                status: HttpStatus.OK,
                message: MessageEnum.DESTROYED,
                data: null,
            }


        } catch (e) {
            this.logger.log(TokenLogsEnum.TOKEN_DESTRUCTION_INITIATED)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }


    }

    public async decodeToken(tokenValue: string): Promise<ResponseTokenDto<string>> {

        this.logger.log(TokenLogsEnum.TOKEN_DECODE_INITIATED)
        try {
            const {userId} = this.jwtService.verify(tokenValue);
            const token = await this.tokenRepository.findOne({where: {value: tokenValue}});

            if (!token) {
                this.logger.log(TokenLogsEnum.TOKEN_DECODE_NOT_FOUND)
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null,
                }
            }

            this.logger.log(TokenLogsEnum.TOKEN_DECODE_SUCCESS)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.DECODED,
                data: userId,
            }
        } catch (e) {

            this.logger.error(TokenLogsEnum.TOKEN_DECODE_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.INVALID_TOKEN,
                data: null,
                errors: e
            }
        }

    }

    private generateToken(userId): string {
        return this.jwtService.sign({userId}, {expiresIn: '10h'})
    }


}
