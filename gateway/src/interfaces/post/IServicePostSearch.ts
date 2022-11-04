export interface IServicePostSearch<T> {
    status: number;
    message: string;
    data: T | null;
}
