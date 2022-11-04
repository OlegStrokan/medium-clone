import {IPost} from "../IPost";

export class IPostCreateResponse {
    status: number;
    message: string;
    data: IPost | null;
    errors: { [key: string]: any } | null;
}
