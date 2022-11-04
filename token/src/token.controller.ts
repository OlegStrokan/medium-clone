import { Controller, Get } from '@nestjs/common';
import { TokenService } from './services/token.service';
import {ResponseTokenDto} from "./interfaces/response-dto/ResponseTokenDto";
import {ResponseTokenDestroyDto} from "./interfaces/response-dto/ResponseTokenDestroyDto";

@Controller()
export class TokenController {
  constructor(private readonly appService: TokenService) {}

  public async createToken(dto: { userId: string }): Promise<ResponseTokenDto> {
    return this.appService.createToken(dto.userId);
  }

  public async destroyToken(dto: { userId: string }): Promise<ResponseTokenDestroyDto> {
    return this.appService.destroyToken(dto.userId);
  }

  public async decodeToken(dto: { userId: string }): Promise<ResponseTokenDto> {
    return this.appService.decodeToken(dto.userId);
  }
}
