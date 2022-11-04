export class ResponsePostDto<T> {
    status: number;
    message: string;
    data: T | null;
}
