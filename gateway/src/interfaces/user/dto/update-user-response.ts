import {IUser} from "../user.interface";

export class UpdateUserResponseDto {
    message: string;
    data: IUser | null;
    errors: { [key: string]: any }
}
