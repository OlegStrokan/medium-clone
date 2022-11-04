import { Injectable } from '@nestjs/common';
import {IPermissionService} from "../interfaces/IPermissionService";
import {IUser} from "../interfaces/IUser";

@Injectable()
export class PermissionService implements IPermissionService {
  public forbiddenPermissions = [
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
