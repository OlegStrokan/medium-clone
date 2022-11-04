import {IPost} from "./IPost";

export interface IServicePostUpdate {
    message: string;
    status; string;
    data: IPost| null;
    errors: { [key: string]: any }
}
