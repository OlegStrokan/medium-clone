import {IUserCreate} from "./user-create.interface";

export interface IUserUpdate extends Omit<IUserCreate, 'id'> {
    id: string;
}
