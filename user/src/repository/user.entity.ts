import { Transform } from "class-transformer";
import {Column, Entity, OneToOne, PrimaryGeneratedColumn, Repository} from "typeorm";
import {ActivationLinkEntity} from "./activationLink.entity";


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

    @Transform(({ value }) => value.trim())
    @Column({ nullable: false})
    password: string;

    @OneToOne(() => ActivationLinkEntity, activationLink => activationLink.user)
    activationLink: string;

}
