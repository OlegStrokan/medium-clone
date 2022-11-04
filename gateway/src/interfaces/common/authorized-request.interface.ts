import {IUser} from "../user/IUser";

export interface IAuthorizedRequest extends Request {
    user?: IUser;
}
