import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRoleEntity} from "../repository/user-role.entity";
import {Repository} from "typeorm";
import {AssignRoleToUserDto} from "../interfaces/request-dtos/create-user.dto";
import {IUserRole} from "../interfaces/IUserRole";
import {UserRoleResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {MessageEnum} from "../interfaces/message-enums/message.enum";

@Injectable()
export class UserRolesService {

    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly userRolesRepository: Repository<IUserRole>
    ) {
    }


    public async assignRoleToUser(dto: AssignRoleToUserDto): Promise<UserRoleResponseDto<IUserRole>> {
        try {

            const newRelation = await this.userRolesRepository.create(dto)

            return {
                status: HttpStatus.CREATED,
                message: MessageEnum.CREATED,
                data: newRelation
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

    public async getRoleForUser(userId: string): Promise<UserRoleResponseDto<IUserRole[]>> {
        try {
            const relation = await this.userRolesRepository.findBy({userId: userId})

            if (!relation) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: MessageEnum.NOT_FOUND,
                    data: null
                }
            }

            return {
                status: HttpStatus.OK,
                message: MessageEnum.OK,
                data: relation
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
}
