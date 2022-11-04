export class ResponsePostGetDto<T> {
    message: string;
    data: T;
    errors: { [key: string]: any };
}
