import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './services/token.service';
import {JwtModule} from "@nestjs/jwt";
import {JwtConfigService} from "./services/jwt-config.service";

@Module({
  imports: [
      JwtModule.registerAsync({
        useClass: JwtConfigService
      })
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
