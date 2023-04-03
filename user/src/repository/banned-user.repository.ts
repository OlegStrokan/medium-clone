import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";

export class BannedUserRepository extends Repository<BannedUserRepository> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    bannedUserId: string;

    @Column()
    banReason: string
}
