import {UserService} from "./user.service";
import {UserRepository} from "../repository/user.repository";
import {TestingModule, Test} from "@nestjs/testing";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {IUser} from "../interfaces/IUser";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {HttpStatus} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {UpdateUserDto} from "../interfaces/request-dtos/update-user.dto";
import {DeleteResult, EntityNotFoundError} from "typeorm";

describe('UserService', () => {
    let userService: UserService
    let userRepository: UserRepository

    const testUser = {
        id: '20392039',
        email: 'test@example.com',
        password: 'pas099sword',
        fullName: "Oleh Strokan",
        userName: "stroka01",
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        findOneOrFail: jest.fn()
                    }
                }
            ]
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<UserRepository>(UserRepository)
    });


    describe('getUserByEmail', () => {
        it('should return a user with status 200 when the user exists', async () => {

            jest.spyOn(userService.userRepository, 'findOneBy').mockResolvedValue(testUser);

            const result: IUser = await userService['getUserByEmail'](testUser.email)

            expect(result).toEqual(testUser);
        });
    })

    describe('getUserById', () => {
        it('should return a user with status 200 when the user exists', async () => {

            jest.spyOn(userService.userRepository, 'findOneBy').mockResolvedValue(testUser);

            const result: IUser = await userService['getUserById'](testUser.id)

            expect(result).toEqual(testUser);
        });
    })

    describe('getUserByEmail', () => {
        it('should return a user with status 200 when the user exists', async () => {

            jest.spyOn(userService.userRepository, 'findOneBy').mockResolvedValue(testUser)

            const result: IUser = await userService['getUserByEmail'](testUser.email)

            expect(result).toEqual(testUser)
        })
    })

    describe('getUser', () => {
        it('should return user with status OK when user exists', async () => {

            jest.spyOn(userService as any, 'getUserById').mockResolvedValue(testUser)

            const result: UserResponseDto = await userService.getUser(testUser.id)

            expect(result.status).toEqual(HttpStatus.OK)
            expect(result.message).toEqual(MessageEnum.OK)
            expect(result.data).toEqual(testUser)
        });
        it('should return 404 not found when user does not exist', async () => {

            jest.spyOn(userService as any, 'getUserById').mockResolvedValue(null);

            const result: UserResponseDto = await userService.getUser(testUser.id);

            expect(result.status).toEqual(HttpStatus.NOT_FOUND)
            expect(result.message).toEqual(MessageEnum.NOT_FOUND)
            expect(result.data).toBeNull()
        });
    })

    describe('createUser', () => {
        const user: CreateUserDto = {
            email: "oleh@gmail.com",
            fullName: "Oleh Strokan",
            userName: "stroka01",
            password: "258120Oleg"

        }
        it('should create a new user if email is not already in use ', async () => {
            jest.spyOn(userService as any, 'getUserByEmail').mockResolvedValue(null)
            jest.spyOn(userService.userRepository, 'create').mockReturnValue(testUser)
            jest.spyOn(userService.userRepository, 'save').mockResolvedValue(testUser)

            const result: UserResponseDto = await userService.createUser(user)

            expect(result.status).toEqual(HttpStatus.CREATED)
            expect(result.message).toEqual(MessageEnum.CREATED)
            expect(result.data.email).toBe(testUser.email)
        });
    })

    describe('updateUser', () => {

        const updateUserDto: UpdateUserDto = {
            id: '1',
            email: 'test@test.com',
            fullName: 'Oleh Strokan',
            userName: 'User',
        };

        const existingUser = {
            id: '1',
            email: 'old@test.com',
            fullName: 'Olejandro Stroka',
            userName: 'stroka01',
        }

        const updatedUser = {
            id: '1',
            email: 'test@test.com',
            fullName: 'Oleh Strokan',
            userName: 'stroka02',
        };

        it('should update a user if user already exist', async () => {

            jest.spyOn(userService.userRepository, 'findOneOrFail').mockResolvedValue(existingUser)
            jest.spyOn(userService.userRepository, 'save').mockResolvedValue(updatedUser)

            const result = await userService.updateUser(updateUserDto);

            expect(result).toEqual({
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: updatedUser,
            });
        })
        it('should return not found error when user not exist', async () => {
            jest.spyOn(userService.userRepository, 'findOneOrFail').mockResolvedValue(null)
            jest.spyOn(userService.userRepository, 'save').mockResolvedValue(updatedUser)

            const result = await userService.updateUser(updateUserDto)

            expect(result).toEqual({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });
    })

    describe('deleteUser', () => {
        const existingUser = {
            id: '1',
            email: 'old@test.com',
            fullName: 'Olejandro Stroka',
            userName: 'stroka01',
        }

        it('should delete user if user exist', async () => {
            jest.spyOn(userService.userRepository, 'findOneOrFail').mockResolvedValue(existingUser)
            jest.spyOn(userService.userRepository, 'delete').mockResolvedValue({affected: 1} as DeleteResult)

            const result = await userService.deleteUser(existingUser.id)

            expect(result).toEqual({
                status: HttpStatus.NO_CONTENT,
                message: MessageEnum.NO_CONTENT,
                data: null
            })
        });

        it('should return not found error', async () => {
            jest.spyOn(userService.userRepository, 'findOneOrFail').mockResolvedValue(null)
            jest.spyOn(userService.userRepository, 'delete').mockResolvedValue({affected: 1} as DeleteResult)


            const result = await userService.deleteUser(existingUser.id)

            expect(result).toEqual({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            })
        });
    })

    describe('deleteUser', () => {
        const id = '123';

        it('should delete user and return NO_CONTENT status', async () => {
            const deleteSpy = jest.spyOn(userService.userRepository, 'delete').mockResolvedValue(undefined);
            const findOneOrFailSpy = jest.spyOn(userService.userRepository, 'findOneOrFail').mockRejectedValue(new Error());

            const result = await userService.deleteUser(id);

            expect(findOneOrFailSpy).toHaveBeenCalledWith({where: {id}});
            expect(deleteSpy).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                status: HttpStatus.NO_CONTENT,
                message: MessageEnum.NO_CONTENT,
                data: null
            });
        });

        it('should return NOT_FOUND status when user is not found', async () => {
            const findOneOrFailSpy = jest.spyOn(userService.userRepository, 'findOneOrFail').mockRejectedValue(new Error());

            const result = await userService.deleteUser(id);

            expect(findOneOrFailSpy).toHaveBeenCalledWith({where: {id}});
            expect(result).toEqual({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: null
            });
        });
    });

})
