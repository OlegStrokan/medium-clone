import {Module} from "@nestjs/common";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {UsersController} from "./controllers/users.controller";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    {
      provide: 'user_service',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 3001,
          },
        })
      }
    }
  ]
})
export class AppModule {}
