import {Column, Entity, PrimaryGeneratedColumn, Repository} from "typeorm";

export interface IUserSubscriptionCreationAttributes {
    userId: string;
    subscriptionId: string;
}


@Entity('user_subscription')
export class UserSubscriptionEntity extends Repository<UserSubscriptionEntity> implements IUserSubscriptionCreationAttributes {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false})
    userId: string;

    @Column({nullable: false})
    subscriptionId: string;


}
