import {Controller, Get} from '@nestjs/common';
import {UserRolesService} from '../services/user-roles.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "../interfaces/message-enums/message-pattern.enum";
import {UserRoleResponseDto} from "../interfaces/response-dtos/user-response.dto";
import {IUserRole} from "../interfaces/IUserRole";

@Controller()
export class UserRoleController {
    constructor(private readonly userRolesService: UserRolesService) {
    }

    @MessagePattern(MessagePatternEnum.ROLE_ASSIGN_TO_USER)
    async assignRoleToUser(jsonDto: string): Promise<UserRoleResponseDto<IUserRole>> {
        return this.userRolesService.assignRoleToUser(JSON.parse(jsonDto));
    }

    @MessagePattern(MessagePatternEnum.ROLE_GET_FOR_USER)
    async getRoleForUser(userId: string): Promise<UserRoleResponseDto<IUserRole[]>> {
         return this.userRolesService.getRoleForUser(userId)
    }
}
