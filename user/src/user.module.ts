import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./repository/user.entity";
import {ConfirmedUserEntity} from "./repository/confirmed-user.entity";
import {BannedUserEntity} from "./repository/banned-user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity, ConfirmedUserEntity, BannedUserEntity]),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: 'localhost',
      port: 5433,
      username: 'stroka01',
      password: 'user',
      database: 'user_db',
      entities: [
 UserEntity, ConfirmedUserEntity, BannedUserEntity
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
