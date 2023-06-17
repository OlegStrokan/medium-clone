import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

export interface IUserRoleCreationAttributes {

}


@Entity('users')
export class UserEntity extends Repository<UserEntity> implements IUserRoleCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;




}
