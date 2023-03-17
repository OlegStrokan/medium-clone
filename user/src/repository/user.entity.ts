import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";


export interface IUserCreationAttributes {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class UserEntity extends Repository<UserEntity> implements IUserCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false})
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

}
