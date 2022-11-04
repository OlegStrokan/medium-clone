import {IUser} from "./IUser";

export interface IPermissionService {
    getAllowedPermissions: (user: IUser, permissions: string[]) => string[];
}
