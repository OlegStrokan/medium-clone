import {Entity, PrimaryGeneratedColumn, Column, Repository} from "typeorm";


@Entity({ name: 'user' })
export class UserEntity extends Repository<UserEntity> {
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Column()
    readonly email: string;

    @Column()
    readonly password: string;

    @Column()
    readonly username: string;

    @Column()
    readonly fullname: string;

    @Column()
    readonly isConfirmed: boolean;
}

