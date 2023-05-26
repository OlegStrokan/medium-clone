import {Module} from "@nestjs/common";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {UsersController} from "./controllers/users.controller";
import {AuthController} from "./controllers/auth.controller";

@Module({
  imports: [],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: 'user_service',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 8001,
          },
        })
      }
    },
    {
      provide: 'token_service',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 8002,
          },
        })
      }
    }
  ]
})
export class AppModule {}
