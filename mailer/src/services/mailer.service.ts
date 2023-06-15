import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {SendMailDto} from "../interfaces/request-dtos/send-mail.dto";
import {SendCodeDto} from "../interfaces/request-dtos/send-code.dto";
import {ResponseDto} from "../interfaces/response-dtos/response.dto";
import *  as nodemailer from 'nodemailer';
import {MessageEnum} from "../interfaces/message-enums/message-enum";
import {MailerLogsEnum} from "../interfaces/message-enums/mailer-logs.enum";

@Injectable()
export class MailerService {
    private logger: Logger
    public transporter;

    constructor() {
        this.logger = new Logger(MailerService.name)
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD
            },
        });
    }

    async sendActivationMail(dto: SendMailDto): Promise<ResponseDto> {

        this.logger.log(MailerLogsEnum.ACTIVATION_MAIL_INITIATED)

        try {
            await this.transporter.sendMail({
                from: process.env.USER_EMAIL,
                to: dto.email,
                subject: "Email activation",
                text: "",
                html: `
            <div>
              h1>Thank you for registering!</h1>
            <h2>To activate, follow the link</h2>
             <a href="${dto.activationLink}">{link}</a>
            </div>
            `
            } as any)

            this.logger.log(MailerLogsEnum.ACTIVATION_MAIL_SENT)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.EMAIL_SUCCESS,
                data: null,
            }
        } catch (e) {
            this.logger.log(MailerLogsEnum.ACTIVATION_MAIL_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }

        }
    }

    async sendCode(dto: SendCodeDto): Promise<ResponseDto> {

        this.logger.log(MailerLogsEnum.CODE_MAIL_INITIATED)

        try {
            await this.transporter.sendMail({
                from: process.env.USER_EMAIL,
                to: dto.email,
                subject: "Verification code",
                text: '',
                html: `
                <div>
            <h1>Hello, ${dto.name}</h1>
            <h2>Please use this code: ${dto.code} to reset your password</h2>
            </div>`
            } as any)

            this.logger.log(MailerLogsEnum.CODE_MAIL_SENT)
            return {
                status: HttpStatus.OK,
                message: MessageEnum.CODE_SUCCESS,
                data: null,
            }
        } catch (e) {
            this.logger.log(MailerLogsEnum.CODE_MAIL_ERROR)
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
                errors: e
            }
        }
    }

}
