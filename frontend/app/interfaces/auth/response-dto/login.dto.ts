import {IUser} from "@/app/interfaces/user/IUser";
import {ISubscription} from "@/app/interfaces/subscribe/ISubscription";
import {IRole} from "@/app/interfaces/role/IRole";

export class LoginResponseDto {
    user: IUser;
    subscriptions: ISubscription[];
    roles: IRole[]
    token: string;
}
