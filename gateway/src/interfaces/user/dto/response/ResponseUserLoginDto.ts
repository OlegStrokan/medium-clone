export class ResponseUserLoginDto {
    message: string;
    data: {
        token: string
    }
    errors: { [key: string]: any }
}
