import { Entity, PrimaryGeneratedColumn, Column, Repository } from "typeorm";

export interface ITokenCreationAttributes {
    value: string;
    userId: string;
}


@Entity('tokens')
export class TokenEntity extends Repository<TokenEntity> implements ITokenCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false})
    value: string;

    @Column({ nullable: false})
    userId: string;
}
