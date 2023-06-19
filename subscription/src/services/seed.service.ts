import {Injectable, Logger} from '@nestjs/common';
import * as fs from "fs";
import {Connection, Repository} from "typeorm";
import {SeedLogMessage} from "../interfaces/seed-logs.enum";
import {SubscriptionEntity} from "../repository/subscription.entity";

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(private connection: Connection) {
    }

    async seedDatabase(): Promise<void> {
        try {

            this.logger.log(SeedLogMessage.DATABASE_SEEDING_INIT)

            const roleRepository: Repository<SubscriptionEntity> = this.connection.getRepository(SubscriptionEntity);

            const hasData = await this.checkDataExistence(roleRepository);

            if (!hasData) {
                // TODO - update PATH
                const testData = fs.readFileSync('/Users/stroka01/Development/medium-clone/subscription/test_db.json', 'utf-8');

                const data = JSON.parse(testData);

                for (const role of data.subscriptions) {
                    const createdRole = roleRepository.create(role)
                    await roleRepository.save(createdRole);
                }

                this.logger.log(SeedLogMessage.DATABASE_SEEDING_COMPLETED);
            } else {
                this.logger.log(SeedLogMessage.DATABASE_ALREADY_CONTAINS_DATA);
            }
        } catch (error) {
            this.logger.log(SeedLogMessage.ERROR_SEEDING_DATABASE)
            await this.clearTables()
            this.logger.error(`${SeedLogMessage.ERROR_SEEDING_DATABASE} ${error}`);
        }
    }

    async checkDataExistence(userRepository: Repository<SubscriptionEntity>): Promise<boolean> {
        const roles = await userRepository.find();
        return roles.length > 1;
    }

    async clearTables(): Promise<void> {
        try {
            this.logger.log(SeedLogMessage.DATABASE_CLEARING_INITIATED)
            const subscriptionsRepository: Repository<SubscriptionEntity> = this.connection.getRepository(SubscriptionEntity);

            await subscriptionsRepository.query('TRUNCATE TABLE subscriptions RESTART IDENTITY');

            this.logger.log(SeedLogMessage.DATABASE_CLEARED)

        } catch (e) {
            this.logger.error(SeedLogMessage.ERROR_CLEARING_DATABASE)
        }
    }
}
