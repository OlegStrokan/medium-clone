
export interface IRoleSearchResponse<T> {
    status: number;
    message: string;
    data: T | null;
}
