import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

export interface IRoleCreationAttributes {

}


@Entity('roles')
export class RoleEntity extends Repository<RoleEntity> implements IRoleCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false})
    description: string;
}
