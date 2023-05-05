import {HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from "../interfaces/IUser";
import {InjectRepository} from "@nestjs/typeorm";
import {EntityNotFoundError, Repository} from "typeorm";
import {UserEntity} from "../repository/user.entity";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";
import {UpdateUserDto} from "../interfaces/request-dtos/update-user.dto";
import {UsersResponseDto} from "../interfaces/response-dtos/users-response.dto";

Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      public readonly userRepository: Repository<UserEntity>
  ) {}

  async getUser(id: string): Promise<UserResponseDto> {


    try {
      const user = await this.userRepository.findOneBy({id});
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: MessageEnum.NOT_FOUND,
          data: null,
        }
      }

      return {
        status: HttpStatus.OK,
        message: MessageEnum.OK,
        data: user
      }
    }
    catch (e) {
      console.log(e)
      if (e instanceof EntityNotFoundError) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: MessageEnum.NOT_FOUND,
          data: null,
        };
      }

      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: MessageEnum.PRECONDITION_FAILED,
        data: e,
      };
    }
  }

  async getUsers(): Promise<UsersResponseDto> {

    try {
      console.log(this.userRepository)
      const users = await this.userRepository.find();

      return {
        status: HttpStatus.OK,
        message: MessageEnum.OK,
        data: users
      }
    } catch (e) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: MessageEnum.PRECONDITION_FAILED,
        data: null
      }
    }
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {

    if  (dto) {
      const existingUser = await this.searchUserHelper(dto.email, dto);

      if (existingUser) {
        return {
          status: HttpStatus.CONFLICT,
          message: MessageEnum.CONFLICT,
          data: null,
          errors: {
            message: 'User with this email already exist'
          }
        }
      } else {
        try {
          const hashPassword = await UserService.hashPassword(dto.password)
          const newUser = await this.userRepository.create({...dto, password: hashPassword});
          const user = await this.userRepository.save(newUser);

          return {
            status: HttpStatus.CREATED,
            message: MessageEnum.CREATED,
            data: user
          }

        } catch (error) {
          return {
            status: HttpStatus.PRECONDITION_FAILED,
            message: MessageEnum.PRECONDITION_FAILED,
            data: null,
          }
        }
      }
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageEnum.NOT_FOUND,
        data: null
      }
    }

  }

  async updateUser(dto: UpdateUserDto): Promise<UserResponseDto> {

    const user = await this.userRepository.findOneOrFail({ where: { id: dto.id }});

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageEnum.NOT_FOUND,
        data: null,
      }
    } else {
      try {
        Object.assign(user, dto);
        const updatedUser = await this.userRepository.save(user);

        return {
          status: HttpStatus.CREATED,
          message: MessageEnum.CREATED,
          data: updatedUser
        }

      } catch (e) {
        return {
          status: HttpStatus.PRECONDITION_FAILED,
          message: MessageEnum.PRECONDITION_FAILED,
          data: null,
        }
      }
    }
  }

  async deleteUser(id: string): Promise<UserResponseDto> {

    const user = this.userRepository.findOneOrFail({where: {id}})

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageEnum.NOT_FOUND,
        data: null
      }
    }

      await this.userRepository.delete(id);

      return {
        status: HttpStatus.NO_CONTENT,
        message: MessageEnum.NO_CONTENT,
        data: null
      }
  }

  private async searchUserHelper(value, dto): Promise<IUser> {
    return await this.userRepository.findOneBy({[value]: dto[value]})
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
  }

  private async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.searchUserHelper(email, email);

    if  (user && await bcrypt.compare(password, user.password)) {
      return user
    }
    return null
  }
}
