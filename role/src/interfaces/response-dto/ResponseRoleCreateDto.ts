import {IRole} from "../IRole";

export class ResponseRoleCreateDto {
    status: number;
    message: string;
    data: IRole | null;
    errors: { [key: string]: any } | null;
}
