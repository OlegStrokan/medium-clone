import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

@Entity('token')
export class TokenEntity extends Repository<TokenEntity> {
    @PrimaryGeneratedColumn()
    private id: string;

    @Column()
    readonly userId: string;

    @Column()
    readonly token: string;
}
