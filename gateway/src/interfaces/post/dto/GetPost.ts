export class GetPost<T> {
    message: string;
    data: {
        post: T | null
    };
    errors: { [key: string]: any };
}
