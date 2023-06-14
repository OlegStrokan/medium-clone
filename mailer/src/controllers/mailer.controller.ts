import {Controller} from '@nestjs/common';
import {MailerService} from '../services/mailer.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "../interfaces/message-enums/message-pattern";
import {ResponseDto} from "../interfaces/response-dtos/response.dto";

@Controller()
export class MailerController {
    constructor(private readonly mailerService: MailerService) {
    }

    @MessagePattern(MessagePatternEnum.SEND_ACTIVATION_MAIL)
    async sendActivationMail(jsonDto: string): Promise<ResponseDto> {
        return await this.mailerService.sendActivationMail(JSON.parse(jsonDto));
    }


    @MessagePattern(MessagePatternEnum.SEND_CODE)
    async sendCode(jsonDto: string): Promise<ResponseDto> {
        return await this.mailerService.sendCode(JSON.parse(jsonDto));
    }
}
