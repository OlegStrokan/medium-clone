import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

@Entity({ name: 'post'})
export class PostEntity extends Repository<PostEntity> {
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Column()
    readonly title: string;

    @Column()
    readonly content: string;

    @Column()
    readonly userId: string;

}
