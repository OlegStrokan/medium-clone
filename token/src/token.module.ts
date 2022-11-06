import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './services/token.service';
import {JwtModule} from "@nestjs/jwt";
import {JwtConfigService} from "./services/jwt-config.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConfigService} from "./services/db-config.service";
import {ConfigService} from "./services/config.service";

@Module({
  imports: [
      JwtModule.registerAsync({
        useClass: JwtConfigService
      }),
      TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig())
  ],
  controllers: [TokenController],
  providers: [
      TokenService,
      ConfigService,
  ],
})
export class TokenModule {}
