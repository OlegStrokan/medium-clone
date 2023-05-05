import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

@Entity('banned-users')
export class BannedUserEntity extends Repository<BannedUserEntity> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    bannedUserId: string;

    @Column()
    banReason: string
}
