export interface IGetItemResponse<T> {
    data: T | null,
    errors: { [key: string]: any};
}
