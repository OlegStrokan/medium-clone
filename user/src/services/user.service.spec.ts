import {UserService} from "./user.service";
import {UserEntity} from "../repository/user.entity";
import {TestingModule, Test} from "@nestjs/testing";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {HttpStatus} from "@nestjs/common";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {UpdateUserDto} from "../interfaces/request-dtos/update-user.dto";

describe('UserService', () => {
    let userService: UserService
    let userRepository: UserEntity

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
                    provide: UserEntity,
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
        userRepository = module.get<UserEntity>(UserEntity)
    });



    describe('getUser', () => {
        it('should return user with status OK when user exists', async () => {

            jest.spyOn(userService as any, 'searchUserHelper').mockResolvedValue(testUser)

            const result: UserResponseDto = await userService.getUser(testUser.id)

            expect(result.status).toEqual(HttpStatus.OK)
            expect(result.message).toEqual(MessageEnum.OK)
            expect(result.data).toEqual(testUser)
        });
        it('should return 404 not found when user does not exist', async () => {

            jest.spyOn(userService as any, 'searchUserHelper').mockResolvedValue(null);

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
            jest.spyOn(userService as any, 'searchUserHelper').mockResolvedValue(null)
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
                status: HttpStatus.OK,
                message: MessageEnum.OK,
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

        it('should delete a user and return NO_CONTENT response', async () => {

            userRepository.findOneBy = jest.fn().mockResolvedValue({ id: existingUser.id });
            userRepository.delete = jest.fn().mockResolvedValue(undefined);


            const result: UserResponseDto = await userService.deleteUser(existingUser.id);


            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: existingUser.id });
            expect(userRepository.delete).toHaveBeenCalledWith(existingUser.id);
            expect(result).toEqual({
                status: HttpStatus.NO_CONTENT,
                message: MessageEnum.NO_CONTENT,
                data: null,
            });
        });

        it('should return NOT_FOUND response when user does not exist', async () => {

            userRepository.findOneBy = jest.fn().mockRejectedValue(undefined);


            const result: UserResponseDto = await userService.deleteUser(existingUser.id);


            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: existingUser.id });
            expect(result).toEqual({
                status: HttpStatus.NOT_FOUND,
                message: MessageEnum.NOT_FOUND,
                data: 'Test for hooks',
            });
        });

        it('should return PRECONDITION_FAILED response when deletion fails', async () => {

            userRepository.findOneBy = jest.fn().mockResolvedValue({ id: existingUser.id });
            userRepository.delete = jest.fn().mockRejectedValue(undefined);


            const result: UserResponseDto = await userService.deleteUser(existingUser.id);


            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: existingUser.id });
            expect(userRepository.delete).toHaveBeenCalledWith(existingUser.id);
            expect(result).toEqual({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            });
        });
    });

})
