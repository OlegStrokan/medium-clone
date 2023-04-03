import {UserService} from "./user.service";
import {UserRepository} from "../repository/user.repository";
import {TestingModule, Test} from "@nestjs/testing";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {IUser} from "../interfaces/IUser";

describe('UserService', () => {
    let userService: UserService
    let userRepository: UserRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                provide: UserRepository,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                    }
                }
            ]
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<UserRepository>(UserRepository)
    });


    describe('getUser', () => {
        it('should return a user with status 200 when the user exists', async () => {
            const id = '1'
            const user = {
                id,
                email: 'test@example.com',
                password: 'password',
                firstName: 'Oleh',
                lastName: 'Strokan'
            }
            jest.spyOn(userService.userRepository, 'findOneBy').mockResolvedValue(user);

            const result: IUser = await userService['getUserById'](id)

            expect(result).toEqual(user);
        });
    })
})
