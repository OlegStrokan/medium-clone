
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import {AllExceptionsFilter} from "./exception.service";

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;

    beforeEach(() => {
        filter = new AllExceptionsFilter();
    });

    describe('catch', () => {
        let mockResponse: Response;
        let mockRequest: Request;
        let mockHost: ArgumentsHost;

        beforeEach(() => {
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;
            mockRequest = {} as any;
            mockHost = {
                switchToHttp: jest.fn().mockReturnThis(),
                getRequest: jest.fn().mockReturnValue(mockRequest),
                getResponse: jest.fn().mockReturnValue(mockResponse),
            } as any;
        });

        it('should handle HttpException and return a JSON response with the corresponding status code and message', () => {
            const exception = new HttpException('Test message', 404);

            filter.catch(exception, mockHost);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                statusCode: 404,
                timestamp: expect.any(String),
                path: undefined,
                message: 'Test message',
            });
        });

        it('should handle non-HttpException exceptions and return a JSON response with status 500 and default error message', () => {
            const exception = new Error('Internal server error');

            filter.catch(exception, mockHost);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                statusCode: 500,
                timestamp: expect.any(String),
                path: undefined,
                message: 'Internal server error',
            });
        });
    });
});
