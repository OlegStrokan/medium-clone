import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './services/post.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConfigService} from "./services/db-config.service";
import {ConfigService} from "./services/config.service";
import {ClientProxyFactory} from "@nestjs/microservices";

@Module({
  imports: [ TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig())],
  controllers: [PostController],
  providers: [
      PostService,
      ConfigService,
      {
          provide: 'USER_SERVICE',
          useFactory: (configService: ConfigService) => {
              const userServiceOptions = configService.get('userService');
              return ClientProxyFactory.create(userServiceOptions)
          }
      }
  ],
})
export class PostModule {}
