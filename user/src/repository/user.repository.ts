import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";


export interface IUserCreationAttributes {
    fullName: string;
    userName: string;
    email: string;
    password: string;
}

export class UserRepository extends Repository<UserRepository> implements IUserCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false})
    fullName: string;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

}
