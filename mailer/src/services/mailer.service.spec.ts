import { HttpStatus } from '@nestjs/common';
import { MailerService } from './mailer.service';
import * as nodemailer from 'nodemailer';
import {SendMailDto} from "../interfaces/request-dtos/send-mail.dto";
import {ResponseDto} from "../interfaces/response-dtos/response.dto";
import {SendCodeDto} from "../interfaces/request-dtos/send-code.dto";
import {MessageEnum} from "../interfaces/message-enums/message-enum";

jest.mock('nodemailer');

describe('MailerService', () => {
    let mailerService: MailerService;
    let nodemailerSendMailMock: jest.Mock;

    beforeEach(() => {
        nodemailerSendMailMock = jest.fn();
        const transporterMock = {
            sendMail: nodemailerSendMailMock,
        };
        nodemailer.createTransport = jest.fn().mockReturnValue(transporterMock);

        mailerService = new MailerService();
    });

    describe('sendActivationMail', () => {
        it('should send activation mail successfully', async () => {
            const sendMailDto: SendMailDto = {
                email: 'test@example.com',
                activationLink: 'https://example.com/activation',
            };

            nodemailerSendMailMock.mockResolvedValueOnce({ response: MessageEnum.EMAIL_SUCCESS });

            const result: ResponseDto = await mailerService.sendActivationMail(sendMailDto);

            expect(result).toEqual({
                status: HttpStatus.OK,
                message: MessageEnum.EMAIL_SUCCESS,
                data: null,
            });
            expect(nodemailerSendMailMock).toHaveBeenCalledWith({
                from: 'oleg@14ua71@gmail.com',
                to: sendMailDto.email,
                subject: 'Email activation',
                text: '',
                html: expect.any(String),
            });
        });

        it('should handle errors when sending activation mail', async () => {
            const sendMailDto: SendMailDto = {
                email: 'test@example.com',
                activationLink: 'https://example.com/activation',
            };

            nodemailerSendMailMock.mockRejectedValueOnce(new Error(MessageEnum.PRECONDITION_FAILED));

            const result: ResponseDto = await mailerService.sendActivationMail(sendMailDto);

            expect(result).toEqual({
                status: HttpStatus.PRECONDITION_FAILED,
                message: 'Precondition failed',
                data: null,
            });
            expect(nodemailerSendMailMock).toHaveBeenCalledWith({
                from: 'oleg@14ua71@gmail.com',
                to: sendMailDto.email,
                subject: 'Email activation',
                text: '',
                html: expect.any(String),
            });
        });
    });

    describe('sendCode', () => {
        it('should send code successfully', async () => {
            const sendCodeDto: SendCodeDto = {
                email: 'test@example.com',
                name: 'John Doe',
                code: '123456',
            };

            nodemailerSendMailMock.mockResolvedValueOnce({ response: MessageEnum.CODE_SUCCESS });

            const result: ResponseDto = await mailerService.sendCode(sendCodeDto);

            expect(result).toEqual({
                status: HttpStatus.OK,
                message: MessageEnum.CODE_SUCCESS,
                data: null,
            });
            expect(nodemailerSendMailMock).toHaveBeenCalledWith({
                from: 'oleg@14ua71@gmail.com',
                to: sendCodeDto.email,
                subject: 'Verification code',
                text: '',
                html: expect.any(String),
            });
        });

        it('should handle errors when sending code', async () => {
            const sendCodeDto: SendCodeDto = {
                email: 'test@example.com',
                name: 'John Doe',
                code: '123456',
            };

            nodemailerSendMailMock.mockRejectedValueOnce(new Error(MessageEnum.PRECONDITION_FAILED));

            const result: ResponseDto = await mailerService.sendCode(sendCodeDto);

            expect(result).toEqual({
                status: HttpStatus.PRECONDITION_FAILED,
                message: MessageEnum.PRECONDITION_FAILED,
                data: null,
            });
            expect(nodemailerSendMailMock).toHaveBeenCalledWith({
                from: 'oleg@14ua71@gmail.com',
                to: sendCodeDto.email,
                subject: 'Verification code',
                text: '',
                html: expect.any(String),
            });
        });
    });
});
