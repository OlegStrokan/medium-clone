import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

export interface IUserRoleCreationAttributes {
    userId: string;
    roleId: string;
}


@Entity('subscription')
export class UserRoleEntity extends Repository<UserRoleEntity> implements IUserRoleCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    roleId: string;


}
