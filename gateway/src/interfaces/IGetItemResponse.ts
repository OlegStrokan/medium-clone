
export interface IGetItemResponse<T> {
    data?: T | null,
    status: number;
    message?: string;
}
