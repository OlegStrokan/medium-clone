import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

export interface ISubscriptionCreationAttributes {
    value: string;
    description: string;

}


@Entity('subscription')
export class SubscriptionEntity extends Repository<SubscriptionEntity> implements ISubscriptionCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false })
    value: string;

    @Column({nullable: false })
    description: string;

    @Column({ nullable: true })
    monthPrice: number;

    @Column({ nullable: true })
    yearPrice: number;


}
