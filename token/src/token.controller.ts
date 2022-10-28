import { Controller, Get } from '@nestjs/common';
import { TokenService } from './services/token.service';

@Controller()
export class TokenController {
  constructor(private readonly appService: TokenService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
