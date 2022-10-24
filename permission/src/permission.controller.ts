import {Controller, Get, HttpStatus} from '@nestjs/common';
import {PermissionService} from './services/permission.service';
import {MessagePattern} from "@nestjs/microservices";
import {IPermissionParams} from "./interfaces/permission-params.interface";
import {IPermissionCheckResponse} from "./interfaces/permission-check-response.interface";
import {permissions} from "./constants/permissions";

@Controller()
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {
    }

    @MessagePattern('permission_check')
    public permissionCheck(permissionParams: IPermissionParams): IPermissionCheckResponse {
        let result: IPermissionCheckResponse;

        if (!permissionParams || !permissionParams.user) {
            result = {
                status: HttpStatus.BAD_REQUEST,
                message: 'permission_check_bad_request',
                errors: null,
            }
        } else {
            const allowedPermissions = this.permissionService.getAllowedPermissions(
                permissionParams.user,
                permissions
            )
            const isAllowed = allowedPermissions.includes(permissionParams.permission)
            result = {
                status: isAllowed ? HttpStatus.OK : HttpStatus.FORBIDDEN,
                message: isAllowed
                    ? 'permission_check_success'
                    : 'permission_check_forbidden',
                errors: null,
            }
        }

        return result;
    }
}
