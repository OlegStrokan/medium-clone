import {HttpStatus, Injectable} from '@nestjs/common';
import {IUser} from 'src/interfaces/user.interface';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../repository/user.entity";
import {Repository} from "typeorm";
import {IUserCreate} from "../interfaces/user-create.interface";
import {IUserCreateResponse} from "../interfaces/user-create-response.interface";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }
    public async createUser(userParams: IUserCreate): Promise<IUserCreateResponse> {
        if (userParams) {
            const existUser = await this.searchUser({email: userParams.email})

            if (existUser) {
                return {
                    status: HttpStatus.CONFLICT,
                    message: 'user_create_conflict',
                    user: null,
                    errors: {
                        email: {
                            message: 'Email already exist',
                            path: 'email'
                        }
                    }
                }
            } else {
                try {
                    const newUser = await this.userRepository.create(userParams);
                    await this.userRepository.save(newUser);


                } catch (e) {

                }
            }

        }
    }

    public async searchUser(dto: { email: string }): Promise<IUser> {
        return await this.userRepository.findOne({ where: { email: dto.email }})
    }



    createUserLink(): any {
        throw new Error('Method not implemented.');
    }
}
