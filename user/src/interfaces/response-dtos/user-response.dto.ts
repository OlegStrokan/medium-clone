
export class UserResponseDto<T> {
    message: string;
    status: number;
    data: T | null;
    errors?: {
        messages: string[]
    };
}
