import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConfigService} from "./services/db-config.service";
import {ConfigService} from "./services/config.service";
import {ClientProxyFactory} from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import {UserEntity} from "./repository/user.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig()),
      TypeOrmModule.forFeature([UserEntity]),
      ConfigModule.forRoot({
          envFilePath: 'env',
      }),
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
      },
      {
          provide: 'ROLE_SERVICE',
          useFactory: (configService: ConfigService) => {
              const roleServiceOptions = configService.get('roleService');
              return ClientProxyFactory.create(roleServiceOptions)
          },
          inject: [ConfigService]
      }
  ],
})
export class UserModule {}
