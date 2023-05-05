import {CreateUserDto} from "./create-user.dto";

export interface UpdateUserDto extends Omit<CreateUserDto, 'password'>{
   id: string
}
