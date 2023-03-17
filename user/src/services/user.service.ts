import {HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUser} from "../interfaces/IUser";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../repository/user.entity";
import {UserResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnums} from "../interfaces/message-enums/message.enums";
import {CreateUserDto} from "../interfaces/request-dtos/create-user.dto";

Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<IUser>,
  ) {}

  async getUser(id: string): Promise<UserResponseDto> {
    const user =  await this.getUserById(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: MessageEnums.NOT_FOUND,
        data: null,
      }
    } else {
      return {
        status: HttpStatus.OK,
        message: MessageEnums.OK,
        data: user
      }
    }
  }

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {

    if  (userData) {
      const existingUser = await this.getUserByEmail(userData.email);

      if (existingUser) {
        return {
          status: HttpStatus.CONFLICT,
          message: MessageEnums.CONFLICT,
          data: null,
          errors: {
            message: 'User with this email already exist'
          }
        }
      } else {
        try {
          const hashPassword = await this.hashPassword(userData.password)
          const newUser = await this.userRepository.create({...userData, password: hashPassword});
          await this.userRepository.save(newUser);

          const user = await this.getUserByEmail(userData.email);

          return {
            status: HttpStatus.CREATED,
            message: MessageEnums.CREATED,
            data: user
          }

        } catch (error) {
          return {
            status: HttpStatus.PRECONDITION_FAILED,
            message: MessageEnums.PRECONDITION_FAILED,
            data: null,
          }
        }
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: MessageEnums.BAD_REQUEST,
        data: null
      }
    }

  }

  async updateUser(id: number, userData: Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findOneOrFail(id);
    Object.assign(user, userData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }


  private async getUserById(id: string): Promise<IUser>  {
    return this.userRepository.findOneBy({ id })
  }

  private async getUserByEmail(email: string): Promise<IUser>  {
    return this.userRepository.findOneBy({ email })
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
  }

  private async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.getUserByEmail(email);

    if  (user && await bcrypt.compare(password, user.password)) {
      return user
    }
    return null
  }
}
