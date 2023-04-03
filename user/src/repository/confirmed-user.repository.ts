import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";

export class ConfirmedUserRepository extends Repository<ConfirmedUserRepository> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    confirmedUserId: string;
}
