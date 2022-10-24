import {IUser} from "./user.interface";

export interface IPermissionParams {
    user: IUser,
    permission: string;
}
