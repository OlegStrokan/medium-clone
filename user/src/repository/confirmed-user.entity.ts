import {Column, PrimaryGeneratedColumn, Repository} from "typeorm";

export class ConfirmedUserEntity extends Repository<ConfirmedUserEntity> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    confirmedUserId: string;
}
