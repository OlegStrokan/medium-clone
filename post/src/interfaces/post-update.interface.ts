import {IPostCreate} from "./post-create.interface";

export interface IPostUpdate extends Omit<IPostCreate, 'ownerId'> {
    id: string;
}
