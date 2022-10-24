import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
