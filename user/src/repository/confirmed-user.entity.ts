import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

@Entity('confirmed-users')
export class ConfirmedUserEntity extends Repository<ConfirmedUserEntity> {
    @PrimaryGeneratedColumn( )
    id: string;

    @Column()
    confirmedUserId: string;
}
