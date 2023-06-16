import {Injectable, Logger} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import * as fs from 'fs';
import {UserEntity} from "../repository/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(private connection: Connection) {
    }

    async seedDatabase(): Promise<void> {
        try {
            const userRepository: Repository<UserEntity> = this.connection.getRepository(UserEntity);

            const hasData = await this.checkDataExistence(userRepository);


            if (!hasData) {
                const testData = fs.readFileSync( '/Users/stroka01/Development/medium-clone/user/test_db.json', 'utf-8');

                const users = JSON.parse(testData);

                for (const userData of users.users) {
                    const hashPassword =  await bcrypt.hash(userData.password, 10);
                    const user = userRepository.create({...userData, password: hashPassword})
                    await userRepository.save(user);
                }

            } else {
            }
        } catch (error) {
            console.log(error)
        }
    }

    async checkDataExistence(userRepository: Repository<UserEntity>): Promise<boolean> {
        // Check if the users table has any data
        const users = await userRepository.find();
        return users.length > 2;
    }
}
