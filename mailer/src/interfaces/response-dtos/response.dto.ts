export class ResponseDto {
    message: string;
    status: number;
    data: null;
    errors?: {
        messages: string[]
    };
}
