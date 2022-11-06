import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConfigService} from "./services/db-config.service";
import {ConfigService} from "./services/config.service";
import {ClientProxyFactory} from "@nestjs/microservices";

@Module({
  imports: [
      TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig())
  ],
  controllers: [UserController],
  providers: [
      UserService,
      ConfigService,
      {
          provide: 'MAILER_SERVICE',
          useFactory: (configService: ConfigService) => {
              const mailerServiceOptions = configService.get('mailerService');
              return ClientProxyFactory.create(mailerServiceOptions)
          },
          inject: [ConfigService]
      }
  ],
})
export class UserModule {}
