import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";


export interface IUserCreationAttributes {
    fullName: string;
    userName: string;
    email: string;
    password: string;
}

@Entity('users')
export class UserEntity extends Repository<UserEntity> implements IUserCreationAttributes {

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
