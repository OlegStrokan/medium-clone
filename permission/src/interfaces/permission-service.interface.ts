import {IUser} from "./user.interface";

export interface IPermissionService {
    getAllowedPermissions: (user: IUser, permissions: string[]) => string[];
}
