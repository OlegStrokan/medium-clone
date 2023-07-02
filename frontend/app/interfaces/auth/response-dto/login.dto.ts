import {IUser} from ".git/interfaces/user/IUser";
import {ISubscription} from ".git/interfaces/subscribe/ISubscription";
import {IRole} from ".git/interfaces/role/IRole";

export class LoginResponseDto {
    user: IUser;
    subscriptions: ISubscription[];
    roles: IRole[]
    token: string;
}
