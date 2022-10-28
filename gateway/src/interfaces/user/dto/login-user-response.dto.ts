export class LoginUserResponseDto {
    message: string;
    data: {
        token: string
    }
    errors: { [key: string]: any }
}
