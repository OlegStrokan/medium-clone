import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";

export class BannedUserEntity extends Repository<BannedUserEntity> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    bannedUserId: string;

    @Column()
    banReason: string
}
