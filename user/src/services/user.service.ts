import {HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from '../interfaces/IUser';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from '../repository/user.entity';
import {UserResponseDto} from '../interfaces/response-dtos/user-response.dto';
import {MessageEnum} from '../interfaces/message-enums/message.enum';
import {CreateUserDto} from '../interfaces/request-dtos/create-user.dto';
import {UpdateUserDto} from '../interfaces/request-dtos/update-user.dto';
import {ValidateUserDto} from '../interfaces/request-dtos/validate-user.dto';
import * as uuid from 'uuid';
import {ActivationLinkEntity} from '../repository/activation-link.entity';
import {IActivationLink} from '../interfaces/IActivationLink';
import {UserLogsEnum} from '../interfaces/message-enums/user-logs.enum';
import {UserDto} from "../interfaces/response-dtos/user.dto";

@Injectable()
export class UserService {
    private readonly logger: Logger;

    constructor(
        @InjectRepository(UserEntity)
        public readonly userRepository: Repository<IUser>,
        @InjectRepository(ActivationLinkEntity)
        public readonly activationLinkRepository: Repository<IActivationLink>
    ) {
        this.logger = new Logger(UserService.name);
    }

    public async getUser(id: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_INITIATED);

        try {
            const user = await this.searchUserHelper(id, 'id');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            this.logger.log(UserLogsEnum.USER_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user,
            };
        } catch (e) {
            this.logger.error(UserLogsEnum.USER_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async getUserByEmail(email: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USERS_INITIATED);

        try {
            const user = await this.searchUserHelper(email, 'email');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_EMAIL,
                    data: null,
                };
            }

            this.logger.log(UserLogsEnum.USER_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: user,
            };
        } catch (e) {
            this.logger.error(UserLogsEnum.USER_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

    public async validateUser(dto: ValidateUserDto): Promise<UserResponseDto<UserDto>> {
        this.logger.log(UserLogsEnum.USER_VALIDATION_INITIATED);

        try {
            const user = await this.searchUserHelper(dto.email, 'email');

            if (!user) {
                this.logger.error(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.UNAUTHORIZED,
                    data: null,
                };
            }

            if (user && (await bcrypt.compare(dto.password, user.password))) {
                const userDto = await UserService.mapUserDto(user)
                this.logger.log(UserLogsEnum.USER_VALIDATION_SUCCESS);
                return {
                    status: HttpStatus.OK,
                    message: MessageEnum.USER_SEARCH_OK,
                    data: userDto,
                };
            } else {
                this.logger.error(UserLogsEnum.USER_VALIDATION_FAILED);
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: MessageEnum.UNAUTHORIZED,
                    data: null,
                };
            }
        } catch (e) {
            this.logger.error(UserLogsEnum.USER_VALIDATION_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            };
        }
    }

    public async getUsers(): Promise<UserResponseDto<IUser[]>> {
        this.logger.log(UserLogsEnum.USERS_INITIATED);

        try {
            const users = await this.userRepository.find();

            this.logger.log(UserLogsEnum.USERS_RETRIEVED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_SEARCH_OK,
                data: users,
            };
        } catch (e) {
            this.logger.error(UserLogsEnum.USERS_RETRIEVING_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            };
        }
    }

    public async createUser(dto: CreateUserDto): Promise<UserResponseDto<IUser>> {

        this.logger.log(UserLogsEnum.USER_CREATION_INITIATED);

        const existingUser = await this.userRepository.findOne({
            where: {email: dto.email},
        });

        if (existingUser) {
            this.logger.warn(UserLogsEnum.USER_CREATION_CONFLICT);
            return {
                status: HttpStatus.CONFLICT,
                message: MessageEnum.USER_CONFLICT,
                data: null,
                errors: {
                    messages: [MessageEnum.USER_CONFLICT],
                },
            };
        }

        try {
            const hashPassword = await UserService.hashPassword(dto.password);

            const user = await this.userRepository.create({
                ...dto,
                password: hashPassword,
            });
            await this.userRepository.save(user);

            const activationLink = await this.activationLinkRepository.create({
                userId: user.id,
                link: uuid.v4(),
            });

            await this.activationLinkRepository.save(activationLink);


            this.logger.log(UserLogsEnum.USER_CREATED);

            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.USER_CREATED,
                data: null,
            };
        } catch (e) {

            this.logger.log(UserLogsEnum.USER_CREATION_ERROR);

            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async updateUser(dto: UpdateUserDto): Promise<UserResponseDto<UserDto>> {
        this.logger.log(UserLogsEnum.USER_UPDATE_INITIATED);

        try {
            const user = await this.searchUserHelper(dto.id, 'id');

            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            if (user.id !== dto.tokenUserId) {
                this.logger.log(UserLogsEnum.USER_NOT_ALLOWED);
                return {
                    status: HttpStatus.FORBIDDEN,
                    message: MessageEnum.FORBIDDEN,
                    data: null,
                }
            }

            await this.userRepository.update(dto.id, dto);

            const updatedUser = await this.searchUserHelper(dto.id, 'id');

            const userDto = await UserService.mapUserDto(updatedUser)

            this.logger.log(UserLogsEnum.USER_UPDATED_SUCCESS);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_UPDATED,
                data: userDto,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_UPDATE_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    public async deleteUser(id: string): Promise<UserResponseDto<IUser>> {
        this.logger.log(UserLogsEnum.USER_DELETION_INITIATED);

        try {
            const user = await this.searchUserHelper(id, 'id');
            if (!user) {
                this.logger.log(UserLogsEnum.USER_NOT_FOUND);
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.USER_NOT_FOUND_ID,
                    data: null,
                };
            }

            await this.userRepository.delete(id);

            this.logger.log(UserLogsEnum.USER_DELETED);
            return {
                status: HttpStatus.OK,
                message: MessageEnum.USER_DELETED,
                data: null,
            };
        } catch (e) {
            this.logger.log(UserLogsEnum.USER_DELETION_ERROR);
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e,
            };
        }
    }

    private async searchUserHelper(value: string, field: string): Promise<IUser | undefined> {
        return await this.userRepository.findOne({where: {[field]: value}});
    }

    private static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    private static async mapUserDto(dto: IUser): Promise<UserDto> {
        return {
            id: dto.id,
            userName: dto.userName,
            fullName: dto.fullName,
            email: dto.email
        }
    }
}

