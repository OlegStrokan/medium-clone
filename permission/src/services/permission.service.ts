import { Injectable } from '@nestjs/common';
import {IPermissionService} from "../interfaces/permission-service.interface";
import {IUser} from "../interfaces/user.interface";

@Injectable()
export class PermissionService implements IPermissionService {
  public forbiddenPermissions = [
      'report_user_by_id',
      'follow_user_by_id',
      'unfollow_user_by_id',
  ]
  getAllowedPermissions(user: IUser, permissions: string[]): string[] {
    return user.isConfirmed
    ? permissions
        : permissions.filter((permission: string) => {
          return !this.forbiddenPermissions.includes(permission);
        })
  }
}
