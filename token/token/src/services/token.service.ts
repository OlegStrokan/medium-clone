import {HttpStatus, Injectable} from '@nestjs/common';
import {TokenEntity} from "../repository/token.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {IToken} from "../interfaces/IToken";
import {JwtService} from "@nestjs/jwt";
import {ResponseTokenDto} from "../interfaces/response-dtos.ts/response-token.dto";
import {MessageEnum} from "../interfaces/message-enums/message-enum";

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(TokenEntity)
        public readonly tokenRepository: Repository<IToken>,
        private readonly jwtService: JwtService,
    ) {
    }

    public async createToken(userId: string): Promise<ResponseTokenDto<IToken>> {

        try {
            const tokenValue = this.generateToken(userId);

            const token = await this.tokenRepository.create({userId: userId, value: tokenValue})
            await this.tokenRepository.save(token)
            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: token,
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async destroyToken(userId: string): Promise<ResponseTokenDto<string>> {
        try {
            const deleteResult = await this.tokenRepository.delete({ userId });

            if (deleteResult.affected === 0) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null,
                }
            }

            return {
                status: HttpStatus.OK,
                message: MessageEnum.DESTROYED,
                data: null,
            }


        } catch (e) {

            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }


    }

    public async decodeToken(tokenValue: string): Promise<ResponseTokenDto<string>> {
        try {
            const { userId } = this.jwtService.verify(tokenValue);
            const token = await this.tokenRepository.findOne({where: {value: tokenValue }});

            if (!token) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null,
                }
            }
            return {
                status: HttpStatus.OK,
                message: MessageEnum.DECODED,
                data: userId,
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.INVALID_TOKEN,
                data: null,
                errors: e
            }
        }

    }

    private generateToken(userId): string {
        return this.jwtService.sign({userId}, { expiresIn: '10h'})
    }


}
