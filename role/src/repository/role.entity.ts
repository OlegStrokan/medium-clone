import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

@Entity({name: 'user'})
export class RoleEntity extends Repository<RoleEntity> {
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Column()
    readonly value: string

    @Column()
    readonly description: string;
}
