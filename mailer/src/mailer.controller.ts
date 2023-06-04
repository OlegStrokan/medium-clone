import {Controller} from '@nestjs/common';
import {MailerService} from './mailer.service';
import {MessagePattern} from "@nestjs/microservices";
import {MessagePatternEnum} from "./interfaces/message-enums/message-pattern";
import {SendMailDto} from "./interfaces/request-dtos/send-mail.dto";
import {SendCodeDto} from "./interfaces/request-dtos/send-code.dto";
import {ResponseDto} from "./interfaces/response-dtos/response.dto";

@Controller()
export class MailerController {
    constructor(private readonly mailerService: MailerService) {
    }

    @MessagePattern(MessagePatternEnum.SEND_ACTIVATION_MAIL)
    async sendActivationMail(dto: SendMailDto): Promise<ResponseDto> {
        return await this.mailerService.sendActivationMail(dto);
    }


    @MessagePattern(MessagePatternEnum.SEND_CODE)
    async sendCode(dto: SendCodeDto): Promise<ResponseDto> {
        return await this.mailerService.sendCode(dto);
    }
}
