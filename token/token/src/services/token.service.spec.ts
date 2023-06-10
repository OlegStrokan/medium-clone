import {TokenService} from "./token.service";
import {TokenEntity} from "../repository/token.entity";
import {IToken} from "../interfaces/IToken";
import {Test, TestingModule} from "@nestjs/testing";
import {ResponseTokenDto} from "../interfaces/response-dtos.ts/response-token.dto";
import {HttpStatus} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {JwtService} from "@nestjs/jwt";

describe('Token service tests', () => {
    let tokenService: TokenService;
    let tokenRepository: TokenEntity;
    let jwtService: JwtService;


    const testToken: IToken = {
        id: "1",
        userId: "2",
        value: "aofu43ryu34f-jw9f-3r49faw04rufwa49rfwji423"
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: TokenEntity,
                    useValue: {
                        create: jest.fn(),
                        delete: jest.fn(),
                        findOne: jest.fn(),
                    }
                }
            ]
        }).compile()

        tokenService = module.get<TokenService>(TokenService);
        tokenRepository = module.get<TokenEntity>(TokenEntity);
        jwtService = module.get<JwtService>(JwtService);
    })


    describe('createToken',  () => {
        it('should return token with status OK when userId exist', async () => {
            jest.spyOn(tokenService as any, 'generateToken').mockResolvedValue(testToken.value);
            jest.spyOn(tokenService.tokenRepository, 'create').mockReturnValue(testToken);
            jest.spyOn(tokenService.tokenRepository, 'save').mockResolvedValue(testToken);

            const result: ResponseTokenDto<IToken> = await tokenService.createToken(testToken.userId);


            expect(result.status).toEqual(HttpStatus.CREATED);
            expect(result.message).toEqual(MessageEnum.CREATED);
            expect(result.data).toEqual(testToken)
        });
    })

})
