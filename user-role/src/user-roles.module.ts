import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRoleController} from "./controllers/user-role.controller";
import {UserRolesService} from "./services/user-roles.service";
import {UserRoleEntity} from "./repository/user-role.entity";

@Module({
  imports: [ClientsModule.register([
    {
      name: 'role_service',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'role_queue',
        queueOptions: { durable: false }
      },
    },
  ]),
    TypeOrmModule.forFeature([
      UserRoleEntity
    ]),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: 'localhost',
      port: 5436,
      username: 'stroka01',
      password: 'user_role',
      database: 'user_role_db',
      entities: [
        UserRoleEntity
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [UserRoleController],
  providers: [UserRolesService],
})
export class UserRolesModule {
}
