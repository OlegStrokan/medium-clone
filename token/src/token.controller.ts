import { Controller, Get } from '@nestjs/common';
import { TokenService } from './services/token.service';
import {ITokenResponse} from "./interfaces/token-response.interface";
import {ITokenDestroyResponse} from "./interfaces/token-destroy-response";

@Controller()
export class TokenController {
  constructor(private readonly appService: TokenService) {}

  public async createToken(dto: { userId: string }): Promise<ITokenResponse> {
    return this.appService.createToken(dto.userId);
  }

  public async destroyToken(dto: { userId: string }): Promise<ITokenDestroyResponse> {
    return this.appService.destroyToken(dto.userId);
  }

  public async decodeToken(dto: { userId: string }): Promise<ITokenResponse> {
    return this.appService.decodeToken(dto.userId);
  }
}
