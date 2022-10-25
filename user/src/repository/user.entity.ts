import {Entity, PrimaryGeneratedColumn, Column, Repository} from "typeorm";


@Entity({name: 'user'})
export class UserEntity extends Repository<UserEntity> {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column()
    fullname: string;

    @Column()
    isConfirmed: boolean;
}

