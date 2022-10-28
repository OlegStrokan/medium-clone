import {IUser} from "./user.interface";

export interface IServiceUserUpdateResponse {
    status: number;
    message: string;
    data: IUser | null;
}
