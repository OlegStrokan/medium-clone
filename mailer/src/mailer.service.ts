import {HttpStatus, Injectable} from '@nestjs/common';
import {SendMailDto} from "./interfaces/request-dtos/send-mail.dto";
import {SendCodeDto} from "./interfaces/request-dtos/send-code.dto";
import {ResponseDto} from "./interfaces/response-dtos/response.dto";
import *  as nodemailer from 'nodemailer';
import {MessageEnum} from "./interfaces/message-enums/message-enum";

@Injectable()
export class MailerService {
    private senderEmail: 'oleg@14ua71@gmail.com';
    private senderPassword: '******';
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            secure: false,
            auth: {
                user: this.senderEmail,
                pass: this.senderPassword,
            },
        });
        ;
    }

    async sendActivationMail(dto: SendMailDto): Promise<ResponseDto> {
        try {
            await this.transporter.sendMail({
                    from: this.senderEmail,
                    to: dto.email,
                    subject: "Email activation",
                    text: "",
                    html: `
            <div>
         h1>Thank you for registering!</h1>
            <h2>To activate, follow the link</h2>
             <a href="${dto.activationLink}">{link}</a>
            </div>
            `,
                }
            )
            return {
                status: HttpStatus.OK,
                message: MessageEnum.EMAIL_SUCCESS,
                data: null,
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }

        }
    }

    async sendCode(dto: SendCodeDto): Promise<ResponseDto> {
        try {
            await this.transporter.sendMail({
                from: this.senderEmail,
                to: dto.email,
                subject: "Verification code",
                text: '',
                html: `
                <div>
            <h1>Hello, ${dto.name}</h1>
            <h2>Please use this code: ${dto.code} to reset your password</h2>
            </div>`
            })

            return {
                status: HttpStatus.OK,
                message: MessageEnum.CODE_SUCCESS,
                data: null,
            }
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            }
        }
    }

}
