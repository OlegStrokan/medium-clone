import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";


export class UserEntity extends Repository<UserEntity> {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

}
