import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './services/permission.service';
import {ConfigService} from "./services/config.service";

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [PermissionService, ConfigService],
})
export class PermissionModule {}
