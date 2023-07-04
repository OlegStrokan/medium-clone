import {ISubscription} from "../../subscribe/ISubscription";
import {IUser} from "../../user/IUser";
import {IRole} from "../../role/IRole";


export interface LoginResponseDto {
    user: IUser;
    subscriptions: ISubscription[];
    roles: IRole[]
    token: string;
}
