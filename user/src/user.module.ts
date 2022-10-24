import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConfigService} from "./services/db-config.service";

@Module({
  imports: [
      TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig())
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
