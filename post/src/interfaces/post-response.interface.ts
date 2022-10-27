export interface IPostResponse<T> {
    status: number;
    message: string;
    data: T | null;
}
