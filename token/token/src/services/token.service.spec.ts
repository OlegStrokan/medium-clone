import {TokenService} from "./token.service";
import {TokenEntity} from "../repository/token.entity";
import {IToken} from "../interfaces/IToken";
import {Test, TestingModule} from "@nestjs/testing";
import {ResponseTokenDto} from "../interfaces/response-dtos.ts/response-token.dto";
import {JwtService} from "@nestjs/jwt";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {HttpStatus} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message-enum";

describe('Token service tests', () => {
    let tokenService: TokenService;
    let tokenRepository: Repository<IToken>;
    let jwtService: JwtService;


    const testToken: IToken = {
        id: '238',
        userId: "2",
        value: "aofu43ryu34f-jw9f-3r49faw04rufwa49rfwji423"
    }

    const decodedToken =  { userId: '2'}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: getRepositoryToken(TokenEntity),
                    useClass: Repository,
                },
                JwtService,
            ],
        }).compile();

        tokenService = module.get<TokenService>(TokenService);
        tokenRepository = module.get<TokenEntity>(TokenEntity);
        jwtService = module.get<JwtService>(JwtService);

    })


    describe('createToken', () => {
        it('should return token with status OK when userId exist', async () => {
            const createSpy = jest.spyOn(tokenRepository, 'create').mockReturnValue(testToken);
            const saveSpy = jest.spyOn(tokenRepository, 'save').mockResolvedValue(testToken);

            jest.spyOn(tokenService as any, 'generateToken').mockReturnValue(testToken.value)

            const result: ResponseTokenDto<IToken> = await tokenService.createToken(testToken.userId);

            expect(createSpy).toHaveBeenCalledWith({userId: testToken.userId, value: testToken.value})
            expect(saveSpy).toHaveBeenCalledWith(testToken)
            expect(result).toEqual<ResponseTokenDto<IToken>>({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: testToken
            })

        });

        it('should return precondition failed error', async () => {
            const error = new Error('some error');
            jest.spyOn(tokenService as any, 'generateToken').mockImplementation(() => {
                throw error
            })

            const result = await tokenService.createToken(testToken.userId)

            expect(result).toEqual<ResponseTokenDto<null>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: error
            })
        })
    })

    describe('destroyToken', () => {
        it('should delete the token and return the response object with success status', async () => {

            const deleteResult = {affected: 1, raw: {}};
            jest.spyOn(tokenRepository, 'delete').mockResolvedValue(deleteResult);

            const result = await tokenService.destroyToken(testToken.userId);

            expect(tokenRepository.delete).toHaveBeenCalledWith({userId: testToken.userId})
            expect(result).toEqual<ResponseTokenDto<IToken>>({
                status: HttpStatus.OK,
                message: MessageEnum.DESTROYED,
                data: null,
            })
        });
        it('should return the not found if token is not found', async () => {
            const deleteResult = {affected: 0, raw: {}};
            jest.spyOn(tokenRepository, 'delete').mockResolvedValue(deleteResult);

            const result =  await tokenService.destroyToken(testToken.userId);

            expect(tokenRepository.delete).toHaveBeenCalledWith({ userId: testToken.userId })
            expect(result).toEqual<ResponseTokenDto<null>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });
    })





    describe('decodeToken', () => {
        it('should decode the token and return the response object with success status', async () => {

        jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
        jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(testToken);

        const result = await tokenService.decodeToken(testToken.value);

        expect(jwtService.verify).toHaveBeenCalledWith(testToken.value);
        expect(tokenRepository.findOne).toHaveBeenCalledWith({ where: { value: testToken.value }})
            expect(result).toEqual<ResponseTokenDto<string>>({
                status: HttpStatus.OK,
                message: MessageEnum.DECODED,
                data: testToken.userId
            })
    });
        it('should return the not found if token is not found', async () => {
            jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken)
            jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(null);

            const result = await tokenService.decodeToken(testToken.value)

            expect(jwtService.verify).toHaveBeenCalledWith(testToken.value);
            expect(tokenRepository.findOne).toHaveBeenCalledWith({ where: { value: testToken.value }})
            expect(result).toEqual<ResponseTokenDto<IToken>>({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });

        it('should return precondition failed error', async () => {

            const error = new Error('some error');
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw error
            })

            const result = await tokenService.decodeToken(testToken.value)

            expect(jwtService.verify).toHaveBeenCalledWith(testToken.value)
            expect(result).toEqual<ResponseTokenDto<null>>({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.INVALID_TOKEN,
                data: null,
                errors: error
            })
        });
    });

})
