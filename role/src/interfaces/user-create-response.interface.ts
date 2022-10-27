import {IRole} from "./role.interface";

export interface IRoleCreateResponse {
    status: number;
    message: string;
    data: IRole | null;
    errors: { [key: string]: any } | null;
}
