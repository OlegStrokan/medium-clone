import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Repository} from "typeorm";
import {UserEntity} from "./user.entity";

export interface IActivationLinkCreationAttributes {
   userId: string;
   link: string;
}


@Entity('activation_links')
export class ActivationLinkEntity extends Repository<ActivationLinkEntity> implements IActivationLinkCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false})
    userId: string;

    @Column({ nullable: false})
    link: string;

    @OneToOne(() => UserEntity, user => user.activationLink)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

}
