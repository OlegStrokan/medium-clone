import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleEntity} from "./repository/role.entity";
import {SeedService} from "./services/seed.service";

@Module({
      imports: [
        TypeOrmModule.forFeature([
          RoleEntity,
        ]),
        TypeOrmModule.forRoot({
          type: "postgres",
          host: 'localhost',
          port: 5435,
          username: 'stroka01',
          password: 'role',
          database: 'role_db',
          entities: [
            RoleEntity
          ],
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
  controllers: [RoleController],
  providers: [RoleService, SeedService],
})
export class RoleModule {}
