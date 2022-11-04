import {PostCreateDto} from "./PostCreateDto";
import {Omit} from "../helpers/Omit";

export class PostUpdateDto extends Omit(PostCreateDto, ['userId']) {
    id: string;
}
