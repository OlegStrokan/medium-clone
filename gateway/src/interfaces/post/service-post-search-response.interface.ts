
export interface IServicePostSearchResponse<T> {
    status: number;
    message: string;
    data: T | null;
}
