import {Module} from '@nestjs/common';
import {TokenController} from './controllers/token.controller';
import {TokenService} from './services/token.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TokenEntity} from "./repository/token.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            signOptions: {
                expiresIn: "10h",
            },
        }),
        TypeOrmModule.forFeature([TokenEntity]),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: 'localhost',
            port: 5434,
            username: 'stroka01',
            password: 'token',
            database: 'token_db',
            entities: [
                TokenEntity
            ],
            autoLoadEntities: true,
            synchronize: true,
        }),

    ],
    controllers: [TokenController],
    providers: [TokenService],
})
export class TokenModule {
}
