import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import {dbConfigService} from "./services/db-config.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "./services/config.service";

@Module({
  imports: [TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig())],
  controllers: [RoleController],
  providers: [RoleService, ConfigService],
})
export class RoleModule {}
