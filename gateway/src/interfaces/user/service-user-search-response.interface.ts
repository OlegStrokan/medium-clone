import {IUser} from "./user.interface";

export interface IServiceUserSearchResponse {
    status: number;
    message: string;
    data: IUser | null;
}
