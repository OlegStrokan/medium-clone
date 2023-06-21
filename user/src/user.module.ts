import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./repository/user.entity";
import {ConfirmedUserEntity} from "./repository/confirmed-user.entity";
import {BannedUserEntity} from "./repository/banned-user.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ActivationLinkEntity} from "./repository/activation-link.entity";
import {SeedService} from "./services/seed.service";

@Module({
    imports: [ClientsModule.register([
    ]),
        TypeOrmModule.forFeature([
            UserEntity,
            ConfirmedUserEntity,
            BannedUserEntity,
            ActivationLinkEntity
        ]),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: 'localhost',
            port: 5433,
            username: 'stroka01',
            password: 'user',
            database: 'user_db',
            entities: [
                UserEntity,
                ConfirmedUserEntity,
                BannedUserEntity,
                ActivationLinkEntity
            ],
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
    controllers: [UserController],
    providers: [UserService, SeedService],
})
export class UserModule {
}

