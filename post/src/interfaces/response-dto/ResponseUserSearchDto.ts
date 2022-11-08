import {IPost} from "../IPost";

export class ResponseUserSearchDto {
    status: number;
    message: string;
    data: IPost | null;
}
