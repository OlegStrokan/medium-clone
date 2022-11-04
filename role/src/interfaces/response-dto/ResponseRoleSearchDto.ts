
export class ResponseRoleSearchDto<T> {
    status: number;
    message: string;
    data: T | null;
}
